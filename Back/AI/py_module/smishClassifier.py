# predict_smishing.py  (training v2 기준)
import os, re, json, unicodedata
import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel
from urlextract import URLExtract
from pykospacing import Spacing

# ---------------- 설정 ----------------
MODEL_NAME = "monologg/kobert"
MAX_LENGTH = 512
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SAVE_PATH = "./py_module/test14_trainer/smishing_model.pt"
TEMPERATURE = 1.0   # 필요하면 temperature.json로 관리

# ---- Threshold 기본값 및 파일에서 로드 ----
THRESHOLD = 0.5
thr_path = os.path.join(os.path.dirname(SAVE_PATH), "threshold.json")
if os.path.exists(thr_path):
    try:
        with open(thr_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            THRESHOLD = float(data.get("threshold", THRESHOLD))
            print(f"[threshold] loaded: {THRESHOLD}")
    except Exception as e:
        print("threshold.json load error:", e)

# ---- 초단문/안전문구 위양성 가드 ----
SAFE_HINTS = ["안녕하세요", "감사합니다", "수고하세요", "좋은 하루", "행복한 하루"]
RISK_TOKENS = ["[URL]", "[OTP]", "[MONEY]", "[PHONE]", "인증", "본인확인", "비밀번호", "결제", "승인", "차단", "연동", "클릭"]

def safe_guard(sentences, p1, tokenizer, hard_thr=0.90, short_len=5):
    joined = " ".join(sentences)
    enc = tokenizer(joined, return_tensors='pt', truncation=True, max_length=512, add_special_tokens=True)
    total_tokens_incl = int(enc['attention_mask'].sum())

    has_risk = any(tok in joined for tok in RISK_TOKENS)
    looks_safe = any(s in joined for s in SAFE_HINTS)

    if total_tokens_incl < short_len and p1 < hard_thr:
        return 0
    if (not has_risk) and looks_safe and p1 < hard_thr:
        return 0
    return None

# ---------------- 전처리 함수 ----------------
extractor = URLExtract()
spacing = Spacing()

RE_ZERO_WIDTH = re.compile(r'[\u200B-\u200D\uFEFF\u2060]')
RE_DOTS = re.compile(r'[·∙・‧]')
RE_HTTP_SPLIT = re.compile(r'h\s*t\s*t\s*p\s*s?', re.IGNORECASE)
RE_URL = re.compile(r'(?:(?:https?://)|(?:www\.))\S+', re.IGNORECASE)
RE_PHONE = re.compile(r'(?:\+82[- ]?)?0?1[0-9][- ]?\d{3,4}[- ]?\d{4}')
RE_ACCOUNT = re.compile(r'\b\d{2,3}[- ]?\d{2,3}[- ]?\d{4,6}\b')
RE_MONEY = re.compile(r'(\d{1,3}(?:,\d{3})+|\d+)\s*(원|만원)')
RE_OTP = re.compile(r'\b\d{4,8}\b')
RE_WEB_PREFIX = re.compile(r'^\s*\[\s*we?b\s*발?\s*신?\s*\]\s*', re.IGNORECASE)
RE_KEEP = re.compile(r'[^가-힣a-zA-Z0-9\[\]\s/_-]')

def clean_text2(text, use_spacing=True, spacing_func=spacing, max_len=500):
    if not isinstance(text, str):
        text = str(text)
    text = unicodedata.normalize("NFC", text)
    text = RE_ZERO_WIDTH.sub('', text)
    text = RE_DOTS.sub('', text)
    text = RE_HTTP_SPLIT.sub(lambda m: 'https' if 's' in m.group(0).lower() else 'http', text)
    text = RE_URL.sub('[URL]', text)
    text = RE_WEB_PREFIX.sub('[WEB] ', text)
    text = RE_PHONE.sub('[PHONE]', text)
    text = RE_ACCOUNT.sub('[ACCOUNT]', text)
    text = RE_MONEY.sub('[MONEY]', text)
    text = RE_OTP.sub('[OTP]', text)
    text = RE_KEEP.sub(' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) > max_len:
        text = text[:max_len].rstrip()
    if use_spacing and spacing_func is not None:
        try:
            kr = sum(1 for ch in text if '가' <= ch <= '힣')
            if kr / max(len(text), 1) > 0.3 and len(text) <= 250:
                text = spacing_func(text)
        except Exception as e:
            print(f"Spacing error: {e}")
    return text

SPLIT_REGEX = re.compile(r'(?: (?<!\d)\.(?!\d)\s* | \n+ )', re.VERBOSE)
def split_by_period_and_newline(text: str):
    if not isinstance(text, str):
        text = str(text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    parts = [p.strip() for p in SPLIT_REGEX.split(text) if p and p.strip()]
    return parts

# ---------------- Mean Pooling ([CLS]/[SEP] 제외) ----------------
def mean_pooling_excl_specials(model_output, attention_mask, input_ids, special_ids, eps=1e-9):
    token_embeddings = model_output[0]                 # [B, L, H]
    mask = attention_mask.clone()                      # [B, L]
    for tid in special_ids:
        mask = mask * (input_ids != tid).long()
    need_backup = (mask.sum(dim=1) == 0)
    if need_backup.any():
        mask[need_backup] = attention_mask[need_backup]
    mask = mask.unsqueeze(-1).expand_as(token_embeddings)
    summed = (token_embeddings * mask).sum(dim=1)
    denom = mask.sum(dim=1).clamp(min=eps)
    return summed / denom

# ---------------- (옵션) Token Dropout 견고화 ----------------
ROBUST_INFER = True        # 추론 시 약한 드롭아웃 평균 사용할지
ROBUST_SAMPLES = 1         # 0~2 권장
WORD_DROPOUT_P = 0.10
SPAN_DROPOUT_P = 0.08
SPAN_DROPOUT_MAXLEN = 2

def tokens_word_span_dropout(input_ids: torch.Tensor,
                             attention_mask: torch.Tensor,
                             tokenizer,
                             p_word=WORD_DROPOUT_P,
                             p_span=SPAN_DROPOUT_P,
                             max_span=SPAN_DROPOUT_MAXLEN):
    ids = input_ids.clone()
    mask_id = tokenizer.mask_token_id or tokenizer.unk_token_id
    special = {tokenizer.cls_token_id, tokenizer.sep_token_id, tokenizer.pad_token_id}
    B, L = ids.shape
    for b in range(B):
        idxs = [i for i in range(L) if attention_mask[b, i] == 1 and ids[b, i].item() not in special]
        # word dropout
        for i in idxs:
            if torch.rand(1).item() < p_word:
                ids[b, i] = mask_id
        # span dropout
        i = 0
        while i < len(idxs):
            if torch.rand(1).item() < p_span:
                span_len = int(torch.randint(1, max_span + 1, (1,)).item())
                for j in idxs[i:i + span_len]:
                    ids[b, j] = mask_id
                i += span_len
            else:
                i += 1
    return ids

# ---------------- 분류기 정의 (학습과 동일) ----------------
class Classifier(nn.Module):
    def __init__(self, input_size, hidden_sizes=[256, 128, 64], output_size=2):
        super().__init__()
        self.classifier = nn.Sequential(
            nn.Linear(input_size, hidden_sizes[0]),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(hidden_sizes[0], hidden_sizes[1]),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(hidden_sizes[1], hidden_sizes[2]),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(hidden_sizes[2], output_size)
        )
    def forward(self, x):
        return self.classifier(x)

# ---------------- 모델 로드 ----------------
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
bert = AutoModel.from_pretrained(MODEL_NAME, trust_remote_code=True).to(DEVICE)
bert.eval()
model = Classifier(input_size=bert.config.hidden_size).to(DEVICE)
model.load_state_dict(torch.load(SAVE_PATH, map_location=DEVICE))
model.eval()
SPECIAL_IDS = {tokenizer.cls_token_id, tokenizer.sep_token_id}

# ---------------- 예측 함수 ----------------
@torch.no_grad()
def _embed_sentence(sent: str) -> torch.Tensor:
    enc = tokenizer(sent, return_tensors='pt', truncation=True, max_length=MAX_LENGTH, padding='max_length')
    enc = {k: v.to(DEVICE) for k, v in enc.items()}
    out = bert(input_ids=enc['input_ids'], attention_mask=enc['attention_mask'])
    pooled = mean_pooling_excl_specials(out, enc['attention_mask'], enc['input_ids'], SPECIAL_IDS)  # [1,H]
    return pooled.squeeze(0)

@torch.no_grad()
def _embed_sentence_robust(sent: str) -> torch.Tensor:
    # 원본 + 드롭아웃 샘플 평균
    enc = tokenizer(sent, return_tensors='pt', truncation=True, max_length=MAX_LENGTH, padding='max_length')
    enc = {k: v.to(DEVICE) for k, v in enc.items()}
    outs = []
    out0 = bert(input_ids=enc['input_ids'], attention_mask=enc['attention_mask'])
    pooled0 = mean_pooling_excl_specials(out0, enc['attention_mask'], enc['input_ids'], SPECIAL_IDS)
    outs.append(pooled0.squeeze(0))
    if ROBUST_INFER and ROBUST_SAMPLES > 0:
        for _ in range(ROBUST_SAMPLES):
            aug_ids = tokens_word_span_dropout(enc['input_ids'], enc['attention_mask'], tokenizer)
            out2 = bert(input_ids=aug_ids, attention_mask=enc['attention_mask'])
            pooled2 = mean_pooling_excl_specials(out2, enc['attention_mask'], aug_ids, SPECIAL_IDS)
            outs.append(pooled2.squeeze(0))
    emb = torch.stack(outs, dim=0).mean(dim=0)
    emb = F.normalize(emb, dim=0)   # 학습과 일치
    return emb

def predict(text: str):
    # 1) 분리 + 전처리
    sentences = split_by_period_and_newline(text)
    sentences = [clean_text2(s, use_spacing=False, max_len=500) for s in sentences]
    sentences = [s for s in sentences if s]

    # 디버그 출력
    for i, s in enumerate(sentences):
        print(f"{s} {i}", flush=True)

    # 2) 문장 임베딩 → 평균 (학습과 동일: CLS/SEP 제외 + L2 normalize)
    sentence_embeddings = []
    for sent in sentences:
        emb = _embed_sentence_robust(sent)  # 견고 임베딩 사용
        sentence_embeddings.append(emb)

    if len(sentence_embeddings) == 0:
        final_embedding = torch.zeros(bert.config.hidden_size, device=DEVICE).unsqueeze(0)
    else:
        final_embedding = torch.stack(sentence_embeddings, dim=0).mean(dim=0, keepdim=True)  # [1,H]

    # 3) 로깅
    print("||emb||:", float(final_embedding.norm().item()), flush=True)

    enc_len_incl = tokenizer(' '.join(sentences), return_tensors='pt',
                             truncation=True, max_length=512, add_special_tokens=True)['attention_mask'].sum().item()
    enc_len_excl = tokenizer(' '.join(sentences), return_tensors='pt',
                             truncation=True, max_length=512, add_special_tokens=False)['attention_mask'].sum().item()
    print(f"tokens: incl_specials={int(enc_len_incl)} / excl_specials={int(enc_len_excl)}", flush=True)

    # 4) 분류
    with torch.no_grad():
        logits = model(final_embedding) / TEMPERATURE
        print("logits:", logits.tolist(), flush=True)
        print("last-layer bias:", model.classifier[-1].bias.detach().cpu().tolist(), flush=True)

        probs = torch.softmax(logits, dim=-1)        # [1, 2]
        p1 = probs[0, 1].item()                      # 스미싱 확률

    # 5) 가드 → 임계값
    guard = safe_guard(sentences, p1, tokenizer, hard_thr=0.90, short_len=5)
    if guard is not None:
        pred = guard
        conf = p1 if pred == 1 else (1 - p1)
    else:
        pred = 1 if p1 >= THRESHOLD else 0
        conf = p1 if pred == 1 else (1 - p1)

    return pred, conf

print("test eval 실행")
def test_eval(input_text: str):
    pred, confidence = predict(input_text)
    print(f"예측: {pred}, 확률: {confidence}\n", flush=True)
    return pred, confidence

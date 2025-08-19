# predict_smishing.py

import torch
import torch.nn as nn
import re
from transformers import AutoTokenizer, AutoModel
from urlextract import URLExtract
from pykospacing import Spacing
import os

# ---------------- 설정 ----------------
MODEL_NAME = "monologg/kobert"
MAX_LENGTH = 512
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SAVE_PATH = "./py_module/test15_trainer/smishing_model.pt"

import json

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
    """
    - 전체 토큰 수가 매우 적고(p1이 아주 높지 않으면) → 정상(0)
    - 위험 토큰 전혀 없고, 안전 인사말 포함(p1이 아주 높지 않으면) → 정상(0)
    """
    joined = " ".join(sentences)
    enc = tokenizer(joined, return_tensors='pt', truncation=True, max_length=512)
    total_tokens = int(enc['attention_mask'].sum())

    has_risk = any(tok in joined for tok in RISK_TOKENS)
    looks_safe = any(s in joined for s in SAFE_HINTS)

    # 1) 초단문: 토큰 너무 적으면 보수적으로 본다
    if total_tokens < short_len and p1 < hard_thr:
        return 0

    # 2) 안전 인사 + 위험 신호 없음: 보수적으로 본다
    if (not has_risk) and looks_safe and p1 < hard_thr:
        return 0

    return None  # 가드 비적용


# ---------------- 전처리 함수 ----------------
extractor = URLExtract()
spacing = Spacing()

def clean_text(text):
    urls = extractor.find_urls(text)
    for url in urls:
        text = text.replace(url, " ")
    text = re.sub(r"(무료\s?수신\s?거부|무료\s?거부|수신\s?거부)[^\n\r가-힣]*", " ", text, flags=re.IGNORECASE)
    text= re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"\(.*?\)", "", text)
    text = re.sub(r'\d+', '*', text)
    text = re.sub(r'[^\w\s가-힣\*]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'\*+', '*', text)
    try:
        text = spacing(text)
    except Exception as e:
        print(f"PyKoSpacing error: {e}")
    return text

SPLIT_REGEX = re.compile(
    r"""
    (?:               # 둘 중 하나를 경계로 분리
        (?<!\d)[.?!](?!\d)\s*   # 숫자 사이가 아닌 마침표('.') + 뒤 공백들
      | \n+                  # 하나 이상의 개행
    )
    """,
    re.VERBOSE
)

def split_by_period_and_newline(text: str):
    if not isinstance(text, str):
        text = str(text)
    # 개행 정규화
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # 분리
    parts = SPLIT_REGEX.split(text)
    # 공백/빈 문자열 제거 (여러 개 개행으로 생긴 공백 포함)
    parts = [p.strip() for p in parts if p and p.strip()]
    return parts


# ------ precompiled patterns ------
RE_ZERO_WIDTH = re.compile(r'[\u200B-\u200D\uFEFF]')
RE_DOTS = re.compile(r'[·∙・‧]')  # 시각적 교란 점
RE_HTTP_SPLIT = re.compile(r'h\s*t\s*t\s*p\s*s?', re.IGNORECASE)

RE_URL = re.compile(
    r'(?:(?:https?://)|(?:www\.))\S+',
    re.IGNORECASE
)
RE_PHONE = re.compile(r"""
(?<!\d)                                           # 숫자 경계
(?:
    # ── 1) 구분자( -, 공백, . )가 있는 일반형 ──
    (?:\+82[-\s.]?)?0?1[016789][-\s.]?\d{3,4}[-\s.]?\d{4}   # 휴대폰
  | (?:\+82[-\s.]?)?0?2[-\s.]?\d{3,4}[-\s.]?\d{4}           # 서울(02)
  | (?:\+82[-\s.]?)?0?(?:[3-6]\d)[-\s.]?\d{3,4}[-\s.]?\d{4}# 기타 지역(031~064)
  | (?:\+82[-\s.]?)?0?(?:70|50\d|60|80)[-\s.]?\d{3,4}[-\s.]?\d{4}  # 특수(070/050x/060/080)
  | (?:\+82[-\s.]?)?1[568]\d{2}[-\s.]?\d{4}                 # 대표번호 15xx/16xx/18xx

    # ── 2) 구분자 없는 digits-only 형 ──
  | (?:\+?82)?0?1[016789]\d{7,8}                            # 휴대폰 (010xxxxxxxx 등)
  | (?:\+?82)?0?2\d{7,8}                                    # 서울(02xxxxxxx~)
  | (?:\+?82)?0?(?:[3-6]\d)\d{7,8}                          # 기타 지역(031/032/...+7~8)
  | 1[568]\d{6}                                             # 1588/1688/18xx-xxxx (8자리)
)
(?!\d)                                                     # 숫자 경계
""", re.VERBOSE)
RE_ACCOUNT = re.compile(r"""
(?<!\d)                                  # 숫자에 붙어 시작하지 않게 (좌측 경계)
(?:
    \d{10,16}                            # 1) 구분자 없는 연속 숫자형: 10~16자리
  |                                      # 2) 구분자 있는 그룹형:
    \d{2,6}(?:[-\s.\u00B7·∙・‧]\d{1,6}){1,3}
    #   └ 첫 그룹 2~6자리  └ (구분자 + 1~6자리)를 1~3회 반복 → 총 2~4그룹
)
(?!\d)                                   # 숫자에 붙어 끝나지 않게 (우측 경계)
""", re.VERBOSE)
RE_MONEY = re.compile(
    r'(\d{1,3}(?:,\d{3})+|\d+)\s*(원|만원)'
)
RE_OTP = re.compile(
    r'\b\d{4,8}\b'   # 인증번호/단축 코드 후보
)

# [Web발신] 변형 정규화: [web], [Web], [WEB발신], 공백/특수점 섞임 등
RE_WEB_PREFIX = re.compile(
    r'^\s*\[\s*we?b\s*발?\s*신?\s*\]\s*', re.IGNORECASE
)

# 허용 문자: 한글, 영문, 숫자, 공백, 대괄호 토큰, 몇 개의 구분자
RE_KEEP = re.compile(r'[^가-힣a-zA-Z0-9\[\]\s/_-]')

def clean_text2(text, use_spacing=True, spacing_func=spacing, max_len=500):
    if not isinstance(text, str):
        text = str(text)

    # 1) 제로폭/시각적 교란 제거
    text = RE_ZERO_WIDTH.sub('', text)
    text = RE_DOTS.sub('', text)

    # 2) 분리된 http 수복 → http / https
    text = RE_HTTP_SPLIT.sub(lambda m: 'https' if 's' in m.group(0).lower() else 'http', text)

    # 3) URL 치환 (먼저 처리)
    text = RE_URL.sub('[URL]', text)

    # 4) [Web발신]류 접두어 정규화
    text = RE_WEB_PREFIX.sub('[WEB] ', text)

    # 5) 전화/계좌/금액/OTP 치환 (순서 중요: PHONE/ACCOUNT → MONEY/OTP 시 오탐 방지)
    text = RE_PHONE.sub('[PHONE]', text)
    text = RE_ACCOUNT.sub('[ACCOUNT]', text)
    text = RE_MONEY.sub('[MONEY]', text)

    # OTP는 실제로 광고/안내에도 많아서 과치환 방지용 힌트:
    # URL/로그인/인증/확인 등 키워드 주변의 4~8자리만 치환하고 싶다면 아래 고급 규칙 사용 고려.
    text = RE_OTP.sub('[OTP]', text)

    # 6) 허용 문자 외 제거 (토큰 대괄호, / _ - 는 남김)
    text = RE_KEEP.sub(' ', text)

    # 7) 공백 정리
    text = re.sub(r'\s+', ' ', text).strip()

    # 8) 길이 제한 (모델 입력 안정화)
    if len(text) > max_len:
        text = text[:max_len].rstrip()

    # 9) 띄어쓰기 교정 (옵션, 느릴 수 있음)
    if use_spacing and spacing_func is not None:
        try:
            # 한글 비율이 높고 길이가 적당할 때만 수행 (비용 절감)
            kr = sum(1 for ch in text if '가' <= ch <= '힣')
            if kr / max(len(text), 1) > 0.3 and len(text) <= 250:
                text = spacing_func(text)
        except Exception as e:
            print(f"Spacing error: {e}")

    return text


def mean_pooling_excl_specials(model_output, attention_mask, input_ids, special_ids, eps=1e-9):
    token_embeddings = model_output[0]                 # [B, L, H]
    mask = attention_mask.clone()                      # [B, L]
    for tid in special_ids:
        mask = mask * (input_ids != tid).long()        # special은 평균에서 제외
    # 전부 0이 되는 엣지 케이스는 원래 마스크로 백업
    need_backup = (mask.sum(dim=1) == 0)
    if need_backup.any():
        mask[need_backup] = attention_mask[need_backup]
    mask = mask.unsqueeze(-1).expand_as(token_embeddings)
    summed = (token_embeddings * mask).sum(dim=1)
    denom = mask.sum(dim=1).clamp(min=eps)
    return summed / denom


# ---------------- Mean Pooling ----------------
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0]
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size())
    sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, dim=1)
    sum_mask = input_mask_expanded.sum(1).clamp(min=1e-9)
    return sum_embeddings / sum_mask

# ---------------- 분류기 정의 ----------------
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

# ---------------- 예측 함수 ----------------

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
bert = AutoModel.from_pretrained(MODEL_NAME, trust_remote_code=True).to(DEVICE)
bert.eval()
model = Classifier(input_size=bert.config.hidden_size).to(DEVICE)
model.load_state_dict(torch.load(SAVE_PATH, map_location=DEVICE))
model.eval()

def predict(text):
     # 2) 분리된 http 수복 → http / https
    sentences = RE_HTTP_SPLIT.sub(lambda m: 'https' if 's' in m.group(0).lower() else 'http', text)

    # 3) URL 치환 (먼저 처리)
    sentences = RE_URL.sub('[URL]', sentences)
    sentences = split_by_period_and_newline(sentences)
    sentences = [clean_text2(s, use_spacing=False, max_len=500) for s in sentences]

    # ✅ 추가: 전처리 후 빈 문장 제거
    sentences = [s for s in sentences if s]   # 또는 if s.strip()

    count=0
    for sentence in sentences:
        print(f'{sentence} {count}', flush=True)
        count+=1
    
    sentence_embeddings = []

    bert.eval()

    for sent in sentences:
        encoded = tokenizer(sent, return_tensors='pt', truncation=True, max_length=MAX_LENGTH, padding='max_length')
        input_ids = encoded['input_ids'].to(DEVICE)
        attention_mask = encoded['attention_mask'].to(DEVICE)

        with torch.no_grad():
            output = bert(input_ids=input_ids, attention_mask=attention_mask)
            pooled = mean_pooling(output, attention_mask)
            sentence_embeddings.append(pooled.squeeze(0))

    if len(sentence_embeddings) == 0:
        final_embedding = torch.zeros(bert.config.hidden_size).unsqueeze(0).to(DEVICE)
    else:
        final_embedding = torch.stack(sentence_embeddings).mean(dim=0).unsqueeze(0).to(DEVICE)

    model.eval()

    print("||emb||:", final_embedding.norm().item(), flush=True)              # 임베딩 노름
    print("tokens:", tokenizer(' '.join(sentences), return_tensors='pt',
                           truncation=True, max_length=512)['attention_mask'].sum().item(),flush=True)

    with torch.no_grad():
        logits = model(final_embedding)
        print("logits:", logits.tolist(),flush=True)                             # 로짓 직접 보기
        print("last-layer bias:", model.classifier[-1].bias.detach().cpu().tolist(),flush=True)
        
        probs = torch.softmax(logits, dim=-1)        # [1, 2]
        p1 = probs[0, 1].item()                      # 스미싱 확률

# 1) 초단문/안전문구 가드로 먼저 걸러보기
    guard = safe_guard(sentences, p1, tokenizer, hard_thr=0.90, short_len=5)
    if guard is not None:
        pred = guard
        conf = p1 if pred == 1 else (1 - p1)
    else:
        # 2) threshold 적용
        pred = 1 if p1 >= THRESHOLD else 0
        conf = p1 if pred == 1 else (1 - p1)
    
        
    return pred, conf

    

print("test eval 실행")
def test_eval(input):

    pred, confidence = predict(input)
    print(f"예측: {pred}, 확률: {confidence} \n", flush=True)
    return pred, confidence

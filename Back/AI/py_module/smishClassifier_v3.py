from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import re
import torch.nn.functional as F
import os

# --- 모델/토크나이저 경로 ---
MODEL_DIR = "py_module/test16_trainer"

# 1) 토크나이저: 학습 디렉터리 우선, 없으면 허브 fallback
if os.path.isdir(MODEL_DIR) and any(os.path.exists(os.path.join(MODEL_DIR, f))
                                     for f in ["tokenizer.json", "spiece.model", "vocab.txt"]):
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, trust_remote_code=True)
else:
    tokenizer = AutoTokenizer.from_pretrained("monologg/kobert", trust_remote_code=True)

model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)

print("토큰나이저 로딩 성공")
print("모델 로딩 성공")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# (옵션) pykospacing
try:
    from pykospacing import Spacing
    spacing = Spacing()
except Exception:
    spacing = None

# ------ precompiled patterns (훈련과 동일) ------
RE_ZERO_WIDTH = re.compile(r'[\u200B-\u200D\uFEFF]')
RE_DOTS = re.compile(r'[·∙・‧]')
RE_HTTP_SPLIT = re.compile(r'h\s*t\s*t\s*p\s*s?', re.IGNORECASE)

RE_URL = re.compile(r'(?:(?:https?://)|(?:www\.))\S+', re.IGNORECASE)
RE_PHONE = re.compile(r'(?:\+82[- ]?)?0?1[0-9][- ]?\d{3,4}[- ]?\d{4}')
RE_ACCOUNT = re.compile(r'\b\d{2,3}[- ]?\d{2,3}[- ]?\d{4,6}\b')
RE_MONEY = re.compile(r'(\d{1,3}(?:,\d{3})+|\d+)\s*(원|만원)', re.IGNORECASE)
RE_OTP = re.compile(r'\b\d{4,8}\b')   # ← 학습 코드가 이 버전이었음 (맥락 기반 아님)

RE_WEB_PREFIX = re.compile(r'^\s*\[\s*we?b\s*발?\s*신?\s*\]\s*', re.IGNORECASE)
RE_KEEP = re.compile(r'[^가-힣a-zA-Z0-9\[\]\s/_\.\-\!\?]')

def clean_text2(text: str, use_spacing=True, max_len=500):
    # 0) 개행 → 마침표 + 공백, 연속 마침표 정리
    text = text.replace("\n", ". ")
    text = re.sub(r"\.{2,}", ".", text).strip()

    # 1) 제로폭/시각적 교란 제거
    text = RE_ZERO_WIDTH.sub('', text)
    text = RE_DOTS.sub('', text)

    # 2) 분리된 http 수복 → http / https
    text = RE_HTTP_SPLIT.sub(lambda m: 'https' if 's' in m.group(0).lower() else 'http', text)

    # 3) URL 치환
    text = RE_URL.sub('[URL]', text)

    # 4) [Web발신]류 접두어 정규화
    text = RE_WEB_PREFIX.sub('[WEB] ', text)

    # 5) 전화/계좌/금액/OTP 치환 (학습과 동일: 광범위 OTP)
    text = RE_PHONE.sub('[PHONE]', text)
    text = RE_ACCOUNT.sub('[ACCOUNT]', text)
    text = RE_MONEY.sub('[MONEY]', text)
    text = RE_OTP.sub('[OTP]', text)

    # 6) 허용 문자 외 제거
    text = RE_KEEP.sub(' ', text)

    # 7) 공백 정리
    text = re.sub(r'\s+', ' ', text).strip()

    # 8) 길이 제한
    if len(text) > max_len:
        text = text[:max_len].rstrip()

    # 9) 띄어쓰기 교정  ← 학습과 동일하게 True로 두는 게 재현성 ↑
    if use_spacing and spacing is not None:
        try:
            kr = sum(1 for ch in text if '가' <= ch <= '힣')
            if kr / max(len(text), 1) > 0.3 and len(text) <= 250:
                text = spacing(text)
        except Exception as e:
            print(f"Spacing error: {e}")

    return text

print("test eval 실행")

def test_eval(user_text: str):
    # 2) 전처리: 학습과 동일 (spacing=True 권장)
    input_text = clean_text2(user_text, use_spacing=True)
    print(input_text, flush=True)

    # 3) 토크나이즈: 학습과 동일
    enc = tokenizer(
        input_text,
        return_tensors='pt',
        padding="max_length",   # ← 학습과 동일
        truncation=True,
        max_length=512
    )
    enc = {k: v.to(device) for k, v in enc.items()}

    model.eval()
    with torch.no_grad():
        logits = model(**enc).logits
        probs = F.softmax(logits, dim=-1).squeeze(0)
        pred = int(torch.argmax(probs).item())
        confidence = float(probs[pred].item())

    return pred, confidence

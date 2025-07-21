from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
from transformers import Trainer
from transformers import TrainingArguments
import numpy as np
import evaluate
import torch
from urlextract import URLExtract
import re

# 전처리 함수
def clean_text(text):
    original = text

    # 1. URL → [url]
    urls = extractor.find_urls(original)
    for url in urls:
        original = original.replace(url, "[url]")

    # 2. [url] → 임시 토큰으로 보호
    original = original.replace("[url]", "__URL__")

    # 3. 숫자 연속 → '*'
    original = re.sub(r'\d+', '*', original)

    # 4. 특수문자 제거 (한글, 영어, 숫자, *, 공백만 남기기)
    original = re.sub(r'[^\w\s가-힣\*]', '', original)

    # 5. 공백 압축
    original = re.sub(r'\s+', ' ', original).strip()

    # 6. 다시 [url] 복원
    original = original.replace("__URL__", "[url]")

    # 7. 띄어쓰기 교정
    '''
    try:
        original = spacing(original)
    except Exception as e:
        print(f"PyKoSpacing error: {e}")
    '''

    return original

def test_eval(input):
    text = tokenizer(input, return_tensors='pt', padding=True, truncation=True)
    model = AutoModelForSequenceClassification.from_pretrained("Kobert_Finetuned")
    print("모델 로딩 성공")
    tokenizer = AutoTokenizer.from_pretrained("monologg/kobert", trust_remote_code=True)
    print("토큰나이저 로딩 성공")
    model.eval()
    print("평가모드")
    extractor = URLExtract()
    #spacing = Spacing()
    with torch.no_grad():
        ret = model(**text)
        ret = ret.logits
        return torch.argmax(ret, dim=-1).item()
    
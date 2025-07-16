from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
from transformers import Trainer
from transformers import TrainingArguments
import numpy as np
import evaluate
import torch
from flask import Flask, request, jsonify
from urlextract import URLExtract
#from pykospacing import Spacing
import re

model = AutoModelForSequenceClassification.from_pretrained("Kobert_Finetuned")
tokenizer = AutoTokenizer.from_pretrained("monologg/kobert", trust_remote_code=True)

extractor = URLExtract()
#spacing = Spacing()

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


model.eval()

def test_eval(input):
    text = tokenizer(input, return_tensors='pt', padding=True, truncation=True)
    with torch.no_grad():
        ret = model(**text)
        ret = ret.logits
        return torch.argmax(ret, dim=-1).item()
    

app = Flask(__name__)

@app.route('/text', methods=['POST'])
def text_eval():
    body = request.get_json()
    print(body['text'])
    cleaned = clean_text(body['text'])
    ret = test_eval(cleaned)

    print(ret)

    ret_json = {
        "result": "true" if ret==1 else "false"
    }

    return jsonify(ret_json)


if __name__=='__main__':
    app.run(host='0.0.0.0', port='3100', debug=True)


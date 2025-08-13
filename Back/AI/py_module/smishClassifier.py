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
MAX_LENGTH = 128
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SAVE_PATH = "./py_module/test6_trainer/smishing_model.pt"

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
model = Classifier(input_size=bert.config.hidden_size).to(DEVICE)
model.load_state_dict(torch.load(SAVE_PATH, map_location=DEVICE))

def predict(text):
    sentences = [clean_text(s.strip()) for s in text.strip().split("\n") if s.strip()]
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

    with torch.no_grad():
        logits = model(final_embedding)
        probs = torch.softmax(logits, dim=-1)
        conf, pred = probs.max(dim=-1)
        conf = conf.tolist()[0]
        pred = pred.tolist()[0]
    
        
    return pred, conf

    

print("test eval 실행")
def test_eval(input):

    pred, confidence = predict(input)
    return pred, confidence
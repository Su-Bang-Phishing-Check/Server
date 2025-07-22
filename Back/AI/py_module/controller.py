print("시작")
from flask import jsonify, request
from .smishClassifier import clean_text, test_eval


def post_text():
    body = request.get_json()
    print(body['text'])
    cleaned = clean_text(body['text'])
    pred, confidence = test_eval(cleaned)

    print(pred)

    ret_json = {
        "isScam": "true" if pred==1 else "false",
        "score": confidence
    }

    return jsonify(ret_json)
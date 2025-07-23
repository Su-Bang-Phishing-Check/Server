print("시작")
from flask import jsonify, request
from .smishClassifier import clean_text, test_eval
from werkzeug.utils import secure_filename
from .process_image import ImagetoText

def post_text():
    body = request.get_json()
    print(body['text'])
    cleaned = clean_text(body['text'])
    pred, confidence = test_eval(cleaned)

    print(pred)

    ret_json = {
        "isScam": 1 if pred==1 else 0,
        "score": confidence
    }

    return jsonify(ret_json)


def post_image():
    file = request.files['image']
    filename = secure_filename(file.filename)
    filepath = f"./uploads/{filename}"
    file.save(filepath)
    res = ImagetoText(filename)
    #디버깅용
    ret_json = {
        "message": "success"
    }

    return jsonify(ret_json)

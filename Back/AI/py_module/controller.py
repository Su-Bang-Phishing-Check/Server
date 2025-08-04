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
    images = request.files.getlist('images')
    filepaths = []

    for image in images:
        filename = secure_filename(image.filename)
        filepath = f"./uploads/{filename}"
        filepaths.append(filepath)
        image.save(filepath)

    ret_json = {
        "data": []
    }
    
    for filepath in filepaths:
        texts = ImagetoText(filepath)
        image_num =1
        temp = {
            "isScam":0,
            "image_idx": image_num
        }
        print(texts)
        for text in texts:
            cleaned = clean_text(text)
            pred, confidence = test_eval(cleaned)
            if pred==1:
                temp["isScam"]=1
        
        ret_json["data"].append(temp)

    return jsonify(ret_json)


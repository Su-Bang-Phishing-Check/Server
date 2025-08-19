print("시작")
from flask import jsonify, request
from .smishClassifier_v4 import test_eval
from werkzeug.utils import secure_filename
from .process_image import ImagetoText

def post_text():
    body = request.get_json()
    print(body['text'])
    if body['text'].isspace()==True:
        return jsonify({
            "isScam": 0,
            "score": 1
        })
    ##cleaned = clean_text(body['text'])
    pred, confidence = test_eval(body['text'])

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

    image_num = 0
    
    for filepath in filepaths:
        texts = ImagetoText(filepath)
        temp = {
            "isScam":0,
            "image_idx": image_num
        }
        #print(texts, flush=True)
        for text in texts:
            #print(text, flush=True)
            #cleaned = clean_text(text)
            if len(text)<=15: continue
            pred, confidence = test_eval(text)
            if pred==1:
                temp["isScam"]=1
            #print("{pred}\n")
        
        ret_json["data"].append(temp)
        image_num+=1
        

    return jsonify(ret_json)


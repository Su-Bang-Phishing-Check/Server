from flask import Flask, request, jsonify

app = Flask(__name__)

app.add_url_rule('/text', view_func=, methods = ['POST'])
app.add_url_rule('/image', view_func=, methods= ['POST'])

@app.route('/text', methods=['POST'])
def post_text():
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


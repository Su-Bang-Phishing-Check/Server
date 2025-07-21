from flask import Flask, request, jsonify
from py_module.controller import post_text

app = Flask(__name__)

app.add_url_rule('/text', view_func=post_text, methods = ['POST'])
#app.add_url_rule('/image', view_func=, methods= ['POST'])


if __name__=='__main__':
    app.run(host='0.0.0.0', port=4100, debug=True)


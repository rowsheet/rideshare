import os
import base64
from flask import Flask, request, Response, make_response, redirect, render_template
import requests

app = Flask(__name__)

API_SERVER = os.getenv("API_SERVER")

@app.route('/auth_callback', methods=['GET'])
def auth_callback():
    nonce = str(request.args.get('auth_nonce'))
    rs_resp = requests.request(
        method="GET",
        url=API_SERVER + "/auth?nonce=" + nonce,
    )
    session_id = rs_resp.json().get("session_id")
    resp = make_response(redirect('/'))
    if rs_resp.status_code == 200:
        resp.set_cookie("session_id", session_id);
    return resp

@app.route('/')
def index():
    session_id = request.cookies.get("session_id")
    authorization = "Bearer " + str(session_id)
    api_resp = requests.request(
        method="GET",
        url=API_SERVER + "/session",
        headers = {
            "Authorization": authorization,
        },
    )
    if api_resp.status_code == 200:
        return "You're logged in. <a href='" + API_SERVER + "/accounts/logout/'>logout</a><pre>" + api_resp.text + "</pre>"
    elif api_resp.status_code == 401:
        return "You're logged out. <a href='" + API_SERVER + "/accounts/login/'>login</a><pre>" + api_resp.text + "</pre>"
    return "Oopps. <pre>%s</pre>" % api_resp.text

@app.route('/test')
def test():
    return render_template("pages/test.html")

@app.route('/<path:path>', methods=['GET', 'POST'])
def catchall(path):
    return "404 Page not found."

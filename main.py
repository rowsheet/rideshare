from flask import Flask, request, Response, make_response, redirect, render_template
import requests

import settings
import api

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

API_SERVER = settings.API_SERVER

@app.route('/auth_callback', methods=['GET'])
def auth_callback():
    auth_nonce = str(request.args.get('auth_nonce'))
    api_resp = api.get_session(auth_nonce)
    resp = make_response(redirect('/'))
    if api_resp.status_code == 200:
        session_id = api_resp.json().get("session_id")
        resp.set_cookie("session_id", session_id);
        return resp
    return "Oops... Something went wrong."

@app.route('/')
def index():
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    api_test = api.api_test(session_id, {"value": "DOO"})
    return render_template("pages/test.html",
        session=session,
        settings=settings,
        api_test=api_test,
    )

@app.route('/<path:path>', methods=['GET', 'POST'])
def catchall(path):
    return "404 Page not found."

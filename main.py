from flask import Flask, request, Response, make_response, redirect, render_template
import requests

import settings
import api

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def index():
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    return render_template("pages/splash_page.html",
        session=session,
        settings=settings,
    )

@app.route('/main_screen')
def main_screen():
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    return render_template("pages/main_screen.html",
        session=session,
        settings=settings,
    )

@app.route('/verification_phone')
def verification_phone():
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    return render_template("pages/verification_phone.html",
        session=session,
        settings=settings,
    )

@app.route('/verification_code')
def verification_code():
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    return render_template("pages/verification_code.html",
        session=session,
        settings=settings,
    )

@app.route('/set_location')
def set_location():
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    return render_template("pages/set_location.html",
        session=session,
        settings=settings,
    )

@app.route('/set_location_later')
def set_location_later():
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    return render_template("pages/set_location_later.html",
        session=session,
        settings=settings,
    )

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

@app.route('/<path:path>', methods=['GET', 'POST'])
def catchall(path):
    return "404 Page not found."

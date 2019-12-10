from flask import Flask, request, Response, make_response, redirect, render_template
import requests

import settings
import api

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

dev_menu = {
    "account": "account",
    "account_created": "account_created",
    "create_account": "create_account",
    "main_screen": "main_screen",
    "set_location": "set_location",
    "set_location_later": "set_location_later",
    "splash_page": "/",
    "verification_code": "verification_code",
    "verification_phone": "verification_phone",
    "payment_methods": "payment_methods",
}

def basic_context(request):
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    context = {
        "session": session,
        "settings": settings,
        "dev_menu": dev_menu,
    }
    return context

@app.route('/')
def index():
    context = basic_context(request)
    return render_template("pages/splash_page.html", **context)

@app.route('/main_screen')
def main_screen():
    context = basic_context(request)
    return render_template("pages/main_screen.html", **context)

@app.route('/verification_phone')
def verification_phone():
    context = basic_context(request)
    return render_template("pages/verification_phone.html", **context)

@app.route('/verification_code')
def verification_code():
    context = basic_context(request)
    return render_template("pages/verification_code.html", **context)

@app.route('/set_location')
def set_location():
    context = basic_context(request)
    return render_template("pages/set_location.html", **context)

@app.route('/set_location_later')
def set_location_later():
    context = basic_context(request)
    return render_template("pages/set_location_later.html", **context)

@app.route('/account')
def account():
    context = basic_context(request)
    return render_template("pages/account.html", **context)

@app.route('/create_account')
def create_account():
    context = basic_context(request)
    return render_template("pages/create_account.html", **context)

@app.route('/account_created')
def account_created():
    context = basic_context(request)
    return render_template("pages/account_created.html", **context)

@app.route('/payment_methods')
def payment_methods():
    context = basic_context(request)
    return render_template("pages/payment_methods.html", **context)

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

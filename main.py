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
    "update_paypal": "update_paypal",
    "update_credit_card": "update_credit_card",
    "profile": "profile",
    "add_trusted_contacts": "add_trusted_contacts",
    "message_contact": "message_contact",
    "help_the_community": "help_the_community",
    "confirm_donation": "confirm_donation",
    "add_credit_card": "add_credit_card",
    "donation_success": "donation_success",
    "ride_details": "ride_details",
    "past_rides": "past_rides",
    "add_tip": "add_tip",
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

@app.route('/update_paypal')
def update_paypal():
    context = basic_context(request)
    return render_template("pages/update_paypal.html", **context)

@app.route('/update_credit_card')
def update_credit_card():
    context = basic_context(request)
    return render_template("pages/update_credit_card.html", **context)

@app.route('/profile')
def profile():
    context = basic_context(request)
    return render_template("pages/profile.html", **context)

@app.route('/add_trusted_contacts')
def add_trusted_contacts():
    context = basic_context(request)
    return render_template("pages/add_trusted_contacts.html", **context)

@app.route('/message_contact')
def message_contact():
    context = basic_context(request)
    return render_template("pages/message_contact.html", **context)

@app.route('/help_the_community')
def help_the_community():
    context = basic_context(request)
    return render_template("pages/help_the_community.html", **context)

@app.route('/confirm_donation')
def confirm_donation():
    context = basic_context(request)
    return render_template("pages/confirm_donation.html", **context)

@app.route('/add_credit_card')
def add_credit_card():
    context = basic_context(request)
    return render_template("pages/add_credit_card.html", **context)

@app.route('/donation_success')
def donation_success():
    context = basic_context(request)
    return render_template("pages/donation_success.html", **context)

@app.route('/ride_details')
def ride_details():
    context = basic_context(request)
    return render_template("pages/ride_details.html", **context)

@app.route('/past_rides')
def past_rides():
    context = basic_context(request)
    return render_template("pages/past_rides.html", **context)

@app.route('/add_tip')
def add_tip():
    context = basic_context(request)
    return render_template("pages/add_tip.html", **context)

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

from flask import Flask, request, Response, make_response, redirect, render_template
import requests

import settings
import api

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

dev_menu = {
    "/rider/splash_page": "/rider/",
    "/rider/account": "/rider/account",
    "/rider/account_created": "/rider/account_created",
    "/rider/create_account": "/rider/create_account",
    "/rider/main_screen": "/rider/main_screen",
    "/rider/set_location": "/rider/set_location",
    "/rider/set_location_later": "/rider/set_location_later",
    "/rider/verification_code": "/rider/verification_code",
    "/rider/verification_phone": "/rider/verification_phone",
    "/rider/payment_methods": "/rider/payment_methods",
    "/rider/update_paypal": "/rider/update_paypal",
    "/rider/update_credit_card": "/rider/update_credit_card",
    "/rider/profile": "/rider/profile",
    "/rider/add_trusted_contacts": "/rider/add_trusted_contacts",
    "/rider/message_contact": "/rider/message_contact",
    "/rider/help_the_community": "/rider/help_the_community",
    "/rider/confirm_donation": "/rider/confirm_donation",
    "/rider/add_credit_card": "/rider/add_credit_card",
    "/rider/donation_success": "/rider/donation_success",
    "/rider/ride_details": "/rider/ride_details",
    "/rider/past_rides": "/rider/past_rides",
    "/rider/add_tip": "/rider/add_tip",
    "/rider/confirm_request": "/rider/confirm_request",
    "/rider/ride_verification": "/rider/ride_verification",
    "/rider/searching_rides": "/rider/searching_rides",
    "/rider/ride_en_route": "/rider/ride_en_route",
    "/rider/settings": "/rider/settings",
    "/rider/email": "/rider/email",
    "/rider/services": "/rider/services",
    "/rider/phone_number": "/rider/phone_number",
    "/rider/location": "/rider/location",
    "/rider/contacts": "/rider/contacts",
    "/rider/notifications": "/rider/notifications",
    "/rider/color_verification": "/rider/color_verification",
    "/rider/ride_status": "/rider/ride_status",
    "/rider/feedback": "/rider/feedback",
    "/rider/message_driver": "/rider/message_driver",
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
    return render_template("pages/index.html", **context)

@app.route('/rider/')
def rider_splash_page():
    context = basic_context(request)
    return render_template("pages/splash_page.html", **context)

@app.route('/rider/main_screen')
def main_screen():
    context = basic_context(request)
    return render_template("pages/main_screen.html", **context)

@app.route('/rider/verification_phone')
def verification_phone():
    context = basic_context(request)
    return render_template("pages/verification_phone.html", **context)

@app.route('/rider/verification_code')
def verification_code():
    context = basic_context(request)
    return render_template("pages/verification_code.html", **context)

@app.route('/rider/set_location')
def set_location():
    context = basic_context(request)
    return render_template("pages/set_location.html", **context)

@app.route('/rider/set_location_later')
def set_location_later():
    context = basic_context(request)
    return render_template("pages/set_location_later.html", **context)

@app.route('/rider/account')
def account():
    context = basic_context(request)
    return render_template("pages/account.html", **context)

@app.route('/rider/create_account')
def create_account():
    context = basic_context(request)
    return render_template("pages/create_account.html", **context)

@app.route('/rider/account_created')
def account_created():
    context = basic_context(request)
    return render_template("pages/account_created.html", **context)

@app.route('/rider/payment_methods')
def payment_methods():
    context = basic_context(request)
    return render_template("pages/payment_methods.html", **context)

@app.route('/rider/update_paypal')
def update_paypal():
    context = basic_context(request)
    return render_template("pages/update_paypal.html", **context)

@app.route('/rider/update_credit_card')
def update_credit_card():
    context = basic_context(request)
    return render_template("pages/update_credit_card.html", **context)

@app.route('/rider/profile')
def profile():
    context = basic_context(request)
    return render_template("pages/profile.html", **context)

@app.route('/rider/add_trusted_contacts')
def add_trusted_contacts():
    context = basic_context(request)
    return render_template("pages/add_trusted_contacts.html", **context)

@app.route('/rider/message_contact')
def message_contact():
    context = basic_context(request)
    return render_template("pages/message_contact.html", **context)

@app.route('/rider/help_the_community')
def help_the_community():
    context = basic_context(request)
    return render_template("pages/help_the_community.html", **context)

@app.route('/rider/confirm_donation')
def confirm_donation():
    context = basic_context(request)
    return render_template("pages/confirm_donation.html", **context)

@app.route('/rider/add_credit_card')
def add_credit_card():
    context = basic_context(request)
    return render_template("pages/add_credit_card.html", **context)

@app.route('/rider/donation_success')
def donation_success():
    context = basic_context(request)
    return render_template("pages/donation_success.html", **context)

@app.route('/rider/ride_details')
def ride_details():
    context = basic_context(request)
    return render_template("pages/ride_details.html", **context)

@app.route('/rider/past_rides')
def past_rides():
    context = basic_context(request)
    return render_template("pages/past_rides.html", **context)

@app.route('/rider/add_tip')
def add_tip():
    context = basic_context(request)
    return render_template("pages/add_tip.html", **context)

@app.route('/rider/confirm_request')
def confirm_request():
    context = basic_context(request)
    return render_template("pages/confirm_request.html", **context)

@app.route('/rider/ride_verification')
def ride_verification():
    context = basic_context(request)
    return render_template("pages/ride_verification.html", **context)

@app.route('/rider/searching_rides')
def searching_rides():
    context = basic_context(request)
    return render_template("pages/searching_rides.html", **context)

@app.route('/rider/ride_en_route')
def ride_en_route():
    context = basic_context(request)
    return render_template("pages/ride_en_route.html", **context)

@app.route('/rider/settings')
def _settings():
    context = basic_context(request)
    return render_template("pages/settings.html", **context)

@app.route('/rider/email')
def email():
    context = basic_context(request)
    return render_template("pages/email.html", **context)

@app.route('/rider/services')
def services():
    context = basic_context(request)
    return render_template("pages/services.html", **context)

@app.route('/rider/phone_number')
def phone_number():
    context = basic_context(request)
    return render_template("pages/phone_number.html", **context)

@app.route('/rider/location')
def location():
    context = basic_context(request)
    return render_template("pages/location.html", **context)

@app.route('/rider/contacts')
def contacts():
    context = basic_context(request)
    return render_template("pages/contacts.html", **context)

@app.route('/rider/notifications')
def notifications():
    context = basic_context(request)
    return render_template("pages/notifications.html", **context)

@app.route('/rider/color_verification')
def color_verification():
    context = basic_context(request)
    return render_template("pages/color_verification.html", **context)

@app.route('/rider/ride_status')
def ride_status():
    context = basic_context(request)
    return render_template("pages/ride_status.html", **context)

@app.route('/rider/feedback')
def feedback():
    context = basic_context(request)
    return render_template("pages/feedback.html", **context)

@app.route('/rider/message_driver')
def message_driver():
    context = basic_context(request)
    return render_template("pages/message_driver.html", **context)

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

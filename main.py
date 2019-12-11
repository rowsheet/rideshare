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
    "/driver/splash_page": "/driver",
    "/driver/main_screen": "/driver/main_screen",
    "/driver/account": "/driver/account",
    "/driver/profile": "/driver/profile",
    "/driver/payment_methods": "/driver/payment_methods",
    "/driver/email": "/driver/email",
    "/driver/phone_number": "/driver/phone_number",
    "/driver/past_rides": "/driver/past_rides",
    "/driver/settings": "/driver/settings",
}

def basic_context(request, user=None):
    session_id = request.cookies.get("session_id")
    session = api.session(session_id)
    context = {
        "user": user,
        "session": session,
        "settings": settings,
        "dev_menu": dev_menu,
    }
    return context

@app.route('/')
def index():
    context = basic_context(request)
    return render_template("pages/index.html", **context)

@app.route('/driver/')
def driver_splash_page():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/splash_page.html", **context)

@app.route('/driver/main_screen')
def driver_main_screen():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/main_screen.html", **context)

@app.route('/driver/account')
def driver_account():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/account.html", **context)

@app.route('/driver/profile')
def driver_profile():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/profile.html", **context)

@app.route('/driver/payment_methods')
def driver_payment_methods():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/payment_methods.html", **context)

@app.route('/driver/email')
def driver_email():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/email.html", **context)

@app.route('/driver/phone_number')
def driver_phone_number():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/phone_number.html", **context)

@app.route('/driver/past_rides')
def driver_past_rides():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/past_rides.html", **context)

@app.route('/driver/settings')
def driver_settings():
    context = basic_context(request, user="driver")
    return render_template("pages/driver/settings.html", **context)

@app.route('/rider/')
def rider_splash_page():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/splash_page.html", **context)

@app.route('/rider/main_screen')
def rider_main_screen():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/main_screen.html", **context)

@app.route('/rider/verification_phone')
def rider_verification_phone():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/verification_phone.html", **context)

@app.route('/rider/verification_code')
def rider_verification_code():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/verification_code.html", **context)

@app.route('/rider/set_location')
def rider_set_location():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/set_location.html", **context)

@app.route('/rider/set_location_later')
def rider_set_location_later():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/set_location_later.html", **context)

@app.route('/rider/account')
def rider_account():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/account.html", **context)

@app.route('/rider/create_account')
def rider_create_account():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/create_account.html", **context)

@app.route('/rider/account_created')
def rider_account_created():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/account_created.html", **context)

@app.route('/rider/payment_methods')
def rider_payment_methods():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/payment_methods.html", **context)

@app.route('/rider/update_paypal')
def rider_update_paypal():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/update_paypal.html", **context)

@app.route('/rider/update_credit_card')
def rider_update_credit_card():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/update_credit_card.html", **context)

@app.route('/rider/profile')
def rider_profile():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/profile.html", **context)

@app.route('/rider/add_trusted_contacts')
def rider_add_trusted_contacts():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/add_trusted_contacts.html", **context)

@app.route('/rider/message_contact')
def rider_message_contact():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/message_contact.html", **context)

@app.route('/rider/help_the_community')
def rider_help_the_community():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/help_the_community.html", **context)

@app.route('/rider/confirm_donation')
def rider_confirm_donation():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/confirm_donation.html", **context)

@app.route('/rider/add_credit_card')
def rider_add_credit_card():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/add_credit_card.html", **context)

@app.route('/rider/donation_success')
def rider_donation_success():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/donation_success.html", **context)

@app.route('/rider/ride_details')
def rider_ride_details():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/ride_details.html", **context)

@app.route('/rider/past_rides')
def rider_past_rides():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/past_rides.html", **context)

@app.route('/rider/add_tip')
def rider_add_tip():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/add_tip.html", **context)

@app.route('/rider/confirm_request')
def rider_confirm_request():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/confirm_request.html", **context)

@app.route('/rider/ride_verification')
def rider_ride_verification():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/ride_verification.html", **context)

@app.route('/rider/searching_rides')
def rider_searching_rides():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/searching_rides.html", **context)

@app.route('/rider/ride_en_route')
def rider_ride_en_route():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/ride_en_route.html", **context)

@app.route('/rider/settings')
def rider__settings():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/settings.html", **context)

@app.route('/rider/email')
def rider_email():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/email.html", **context)

@app.route('/rider/services')
def rider_services():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/services.html", **context)

@app.route('/rider/phone_number')
def rider_phone_number():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/phone_number.html", **context)

@app.route('/rider/location')
def rider_location():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/location.html", **context)

@app.route('/rider/contacts')
def rider_contacts():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/contacts.html", **context)

@app.route('/rider/notifications')
def rider_notifications():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/notifications.html", **context)

@app.route('/rider/color_verification')
def rider_color_verification():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/color_verification.html", **context)

@app.route('/rider/ride_status')
def rider_ride_status():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/ride_status.html", **context)

@app.route('/rider/feedback')
def rider_feedback():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/feedback.html", **context)

@app.route('/rider/message_driver')
def rider_message_driver():
    context = basic_context(request, user="rider")
    return render_template("pages/rider/message_driver.html", **context)

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

import os

API_SERVER = os.getenv("API_SERVER")
LOGIN_URL = API_SERVER + "/accounts/login"
LOGOUT_URL = API_SERVER + "/accounts/logout"

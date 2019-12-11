import os

API_SERVER = str(os.getenv("API_SERVER"))
LOGIN_URL = API_SERVER + "/accounts/login"
LOGOUT_URL = API_SERVER + "/accounts/logout"

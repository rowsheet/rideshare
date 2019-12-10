import requests

import settings

def get_session(auth_nonce):
    api_resp = requests.request(
        method="GET",
        url=settings.API_SERVER + "/auth?nonce=" + auth_nonce,
    )
    return api_resp

def session(session_id):
    authorization = "Bearer " + str(session_id)
    api_resp = requests.request(
        method="GET",
        url=settings.API_SERVER + "/session",
        headers = {
            "Authorization": authorization,
        },
    )
    session = api_resp.json()
    if api_resp.status_code == 200:
        session["valid"] = True
    else:
        session["valid"] = False
    return session

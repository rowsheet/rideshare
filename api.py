import requests

import settings

def api_test(session_id, args):
    api_resp = requests.request(
        method="POST",
        url=settings.API_SERVER + "/v1/api_test/api_test/api_test",
        headers = {"Authorization": "Bearer " + str(session_id)},
        data=args,
    )
    return api_resp;

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

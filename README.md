# RideShare

RideShare web-client POC using an API server with federated-login (Google and Facebook).

Add necessary configuration to your local dev environment; should look something like this:

    export API_SERVER="https://api.example.com"
    export PORT=8080
    export ENTRYPOINT="main.py"
    export ENVIRONMENT="development"

    API_SERVER=$API_SERVER \
        FLASK_APP=$ENTRYPOINT \
        FLASK_ENV=$ENVIRONMENT \
        flask run \
        -p $PORT

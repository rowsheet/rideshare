# Define these variables and copy this file to a file you don't commit
# (so you're not committing sensitive credentials).

export API_SERVER="[API_SERVER]" # i.e. https://api.yourapp.com
export PORT=[PORT] # i.e. 5000
export ENTRYPOINT="[ENTRYPOINT]" # i.e. main.py
export ENVIRONMENT"[ENVIRONMENT]" # i.e. development

API_SERVER=$API_SERVER \
    FLASK_APP=$ENTRYPOINT \
    FLASK_ENV=$ENVIRONMENT \
    flask run \
    -p $PORT

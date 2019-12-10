# Web Client

Web-based demo of using the API server with authentication over managed, federated-login.

This application uses managed, federated login for auth providers you specify (i.e. Google, Facebook, etc). You will need to configure a number of things for both the API server and the web-client.

## API Server

1. Web-client URL
2. OAuth Client App IDs
3. OAuth Client Secret Keys

## Web-Client

1. API Server URL

When a request is made to the web-client, it's the web client-s responsibility to authenticate the request by parsing the `session_id` from however it wants to persist that data with the client (i.e. through a cookie or the request header `Set-Cookie`).

Once the request's `session_id` is parsed, it needs to be validaded. This can either be done by passing the parameter to the `API_SERVER` at `/session` or using it in whatever API requests the client is making to the API Server. In both cases, the `session_id` is passed as the `Authorization` header (type `Bearer`). `Bearer` means the header uses only this ID as a token versus type `Basic` where a username and password is required. API requests (with required authorization) can be seen at the documentation section of the API server (`/docs/[version]`).

## Page Loading Steps:

1. Load page and check for `session_id` cookie.
2. Validate request at `[API_SERVER]/session` using `session_id` as the `Authorization` type `Bearer`.

## Login Steps:

1. Re-direct an unauthenticated (logged-out) request to `[API_SERVER]/accounts/login`.
2. Collect the value of the `GET` parameter `auth_nonce` after a request is loaded `/auth_callback`.
3. Load the `session_id` from the `[API_SERVER]/auth?nonce=[auth_nonce]`.
4. Use the `session_id` as the client's authentication key and to authenticate API request.

## Logout Steps:

1. Re-direct an authenticated (logged-in) request to `[API_SERVER]/accounts/logout`.

## By RowSheet

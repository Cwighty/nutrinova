# Getting Started

The best way to run the project is to use the devcontainer. This will ensure that you have all the necessary tools and dependencies installed.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Visual Studio Code Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Running the project

1. Clone the repository
2. Open the repository in Visual Studio Code
3. Make sure you have the Remote - Containers extension installed
4. Ctrl + Shift + P and select `Remote-Containers: Reopen in Container`
5. Wait for the container to build

Note: You may also be able to start up the project by running `docker compose up` in the .devcontainer folder

## First time Keycloak setup

Keycloak is used for authentication. The first time you run the project you will need to set up a new realm and a new client.

IMPORTANT: For keycloak to work correctly in development you need to add the following line to your hosts file (/etc/hosts on linux, C:\Windows\System32\drivers\etc\hosts on windows):

```
127.0.0.1 nutrinova-kc
```

1. Open a browser and navigate to `http://localhost:8080`
2. Log in with the following credentials:
   - Username: `admin`
   - Password: `password`
3. Click on the drop down in the top left and click `Create Realm` and create a new realm with the following name
   - Name: `nutrinova`
4. Create a new client with the following client ID
   - Client ID: `nutrinova-ui`
5. Don't touch anything on the next page in the client creation
6. Add these to the Valid redirect urls on the next page
   - `http://localhost:3000/api/auth/callback/oidc`
   - `https://localhost:3000/api/auth/callback/oidc`
7. That is all, don't touch anything else, this should work. You should now have a new realm called `nutrinova` and under clients a new client called `nutrinova-ui`

### Turn on User Registration

1. `Realm Settings` -> `Login`
2. User Registration ON

## Logging in

1. Open a browser and navigate to `http://localhost:3000`
2. Click on `Register`, this will navigate you to the Keycloak login page if everything is set up correctly
3. Click on `Register` and create a new user
4. You should be redirected back to the application and be logged in

## Environment Variables

For full functionality, you will need to create an `.env.local` file in the root of the NutrinovaApi (`nutrinova-api/NutrinovaApi/.env.local`) project with the following variables:

- `USDA_API_KEY`: The API key for the USDA API for searching for food items
- `OPENAI_API_KEY`: The API key for the OpenAI API for talking to the Nova Chatbot

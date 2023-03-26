# Discoverify backend

## First time setup

1. Create `.env` file from `.env.example` file

```bash
cp .env.example .env
```

2. Log in to Spotify Developer Dashboard with your Spotify account:
https://developer.spotify.com/dashboard/login

3. After logging in, click on `CREATE AN APP` button, enter the app name and confirm with the `CREATE` button.

4. After creating the app, you will be redirected to the app's dashboard. Click on `EDIT SETTINGS` button and add `http://localhost:5173/authorize` to the `Redirect URIs` list. Click on `SAVE` button at the bottom to save the changes.

5. Copy the `Client ID` and `Client Secret` from the app's dashboard and paste them into the `.env` file. The rest of the variables can be left as they are.

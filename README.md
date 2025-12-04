This Miro app demonstrates using [usage-based](https://www.salable.app/features/usage-based-pricing) billing with Salable.

## Configure Salable

1. [Sign up](https://salable.app/login) for Salable or [login](https://salable.app/login) if you already have an account.
2. Ensure you have `Test Mode` enabled.

#### Setup Product

1. Go to the Products page in the Salable dashboard and click the `Import product` button.
2. Navigate to this demo project in the file system on your machine. Select `salable-product.yaml` in the root of the project and import it.
3. As this is a paid product, you'll need to select a payment integration.
4. Click `Import file`.

### Update Environment Variables

1. Copy the Product ID from the `Overview` tab and assign to `NEXT_PUBLIC_PRODUCT_UUID` in the `.env` file.
2. Go to `Plans`. Assign the `Shapes User` ID to `NEXT_PUBLIC_SALABLE_USER_UUID` and `Shapes Board` ID to `NEXT_PUBLIC_SALABLE_BOARD_PLAN_UUID`.
3. Go to `API Keys`.
4. Copy the API Key that was generated on sign up and assign to `SALABLE_API_KEY`.
5. Run `npm run dev`


## Create a Miro app

### How to start locally

1. [Sign in](https://miro.com/login/) to Miro, and then create a
   [Developer team](https://developers.miro.com/docs/create-a-developer-team)
   under your user account.

2. [Create an app in Miro](https://developers.miro.com/docs/build-your-first-hello-world-app#step-2-create-your-app-in-miro).

- Click the **Create new app** button.
- On the **Create new app** modal, give your app a name, assign it to your
  Developer team, and then click **Create**.

3. Configure the app:

- In your account profile, go to **Your apps**, and then select the app you just
  created to access its configuration page.
- On the app configuration page, go to **App Credentials**, and copy the app
  **Client ID** and **Client secret** values: you'll need to enter these values
  in step 4 below.
- Go to **App URL** and enter the following URL: `http://localhost:3000`
- Lastly, go to **Permissions**, and select the following permissions:
  - `board:read`
  - `board:write`
  - `identity:read`

4. Open the [`.env`](.env) file, and enter the app client ID and client secret
   values that you saved at the beginning of step 3 above.
5. Run `npm run start` to start developing.

When your server is up and running:

- Go to [Miro.com](https://miro.com).
- Make sure you're in your developer team and open a board.
- To start your app, click the app icon in the app toolbar on the left.

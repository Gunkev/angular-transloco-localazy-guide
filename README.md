# Localize an Angular app with Transloco and Localazy

This repository accompanies the Localazy tutorial on localizing an Angular app with Transloco. It contains two versions of an account settings page so you can follow the tutorial from the beginning or explore the completed workflow.

| App | Where to start |
| --- | --- |
| [Angular settings starter](./angular-settings-starter/) | Start here to follow the tutorial. The page is already built and runs in English. |
| [Completed Angular example](./angular-localazy/) | See how the app switches between English, French, and Japanese and uses Localazy to manage its translation files. |

## Run either app

Open the folder for the app you want to run, then install its dependencies and start the development server.

```bash
npm ci
npm start
```

Open `http://localhost:4200`. Each app has its own README with setup details. The completed example includes the translation files, so you can run it without Localazy credentials. You’ll need your own Localazy project keys to upload or download translations.

# Angular settings starter

The starting point for **How to localize an Angular app with Transloco and Localazy**. Follow the tutorial to turn this English settings page into an app that supports English, French, and Japanese.

For the finished version, see [angular-localazy](../angular-localazy/).

## Requirements

- Node.js 24.15.0 or later in the 24.x series.
- npm 11.

The starter uses Angular 22, standalone components, and typed reactive forms.

## Run locally

From this directory, install the locked dependencies and start the development server.

```bash
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Explore the starter

Change the display name to update the greeting. Clear either field and save to see the required-field messages.

Try saving with `alex@example`. The page requires a dot in the email domain and shows a red alert explaining what to fix. Change it to `alex@example.com` and save again to see the confirmation.

Saving keeps the form values for the current page load. Reloading restores the initial values.

## Follow the tutorial

The interface text starts in these files:

| File | What it contains |
| --- | --- |
| `src/app/settings-page.html` | Labels, greeting, validation messages, and the English language option. |
| `src/app/settings-page.ts` | Form behavior and save messages. |
| `src/app/app.config.ts` | Application providers, where you’ll configure Transloco. |
| `src/app/settings-page.spec.ts` | Four automated tests for validation, saving, and the greeting. |

During the tutorial, you’ll create translation files in `public/i18n`, connect them to Localazy, and enable language switching.

## Run the tests

```bash
npm test
```

The starter includes four tests. As you localize the app, the tutorial shows you how to update their setup and assertions.

## Build for production

```bash
npm run build
```

The build output is written to `dist/angular-settings-starter/browser`.
# Angular localization with Transloco and Localazy

The completed example for **How to localize an Angular app with Transloco and Localazy**.

This account settings page supports English, French, and Japanese. Transloco loads translations at runtime, while Localazy manages the translation workflow.

To follow the tutorial from the beginning, use [angular-settings-starter](../angular-settings-starter/).

## Requirements

- Node.js 24.15.0 or later in the 24.x series.
- npm 11.

The app uses Angular 22 and Transloco 8.4.0.

## Run locally

From this directory, install the locked dependencies and start the development server.

```bash
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200).

The translation files are included, so you can run the app without Localazy credentials.

## Explore the app

Use the language selector to switch between English, French, and Japanese. The heading, greeting, form messages, browser tab title, and document language follow your selection. Entered form values stay intact when you switch.

Try saving with an address such as `alex@example` to see the missing-dot alert. Correct it to `alex@example.com` and save again to see the confirmation.

Reloading restores the initial form values and returns the interface to English.

## Translation files

| File | Language |
| --- | --- |
| `public/i18n/en.json` | English source |
| `public/i18n/fr.json` | French |
| `public/i18n/ja.json` | Japanese |

The loader in `src/app/transloco-loader.ts` requests the file matching the active language.

## Connect your own Localazy project

Create a Localazy project with English as its source language. Add French and Japanese as target languages, and copy your project’s read and write keys from **Settings → Access keys**.

Create `localazy.keys.json` next to `localazy.json`.

```json
{
  "writeKey": "your-write-key",
  "readKey": "your-read-key"
}
```

This file is excluded from Git. Keep your keys out of the translation files and application source.

Upload the English source from the app root.

```bash
npm exec -- localazy upload
```

After translating and approving the strings in Localazy, preview the download paths, then download the files.

```bash
npm exec -- localazy download -s
npm exec -- localazy download
```

The configuration uploads only `en.json` and downloads target-language files into `public/i18n`. Downloads overwrite the existing target files.

For more details, follow the [Localazy Angular quick start](https://localazy.com/docs/integrations/quick-start-angular).

## Run the tests

```bash
npm test
```

The suite contains five tests covering validation, saving, the personalized greeting, and language switching. The switching test checks translated messages, preserved form values, the browser title, and the document language.

## Build for production

```bash
npm run build
```

The build output is written to `dist/angular-localazy/browser`. The build includes the translation files currently in `public/i18n`.
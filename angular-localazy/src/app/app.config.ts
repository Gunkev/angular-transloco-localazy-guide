import {
  isDevMode,
  provideBrowserGlobalErrorListeners,
  type ApplicationConfig,
} from "@angular/core";
import { provideTransloco } from "@jsverse/transloco";
import { TranslocoHttpLoader } from "./transloco-loader";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideTransloco({
      config: {
        availableLangs: ["en", "fr", "ja"],
        defaultLang: "en",
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};

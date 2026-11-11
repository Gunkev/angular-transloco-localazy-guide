import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { SettingsPage } from './app/settings-page';

void bootstrapApplication(SettingsPage, appConfig).catch((error: unknown) => console.error(error));

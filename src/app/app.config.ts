import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router'; 
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // חובה ל-PrimeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient(),
    provideAnimationsAsync(), // הוספנו תמיכה באנימציות
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
            darkModeSelector: false // מבטל קפיצות צבע מוזרות אם אין לך מצב לילה מוגדר
        }
      }
    })
  ]
};
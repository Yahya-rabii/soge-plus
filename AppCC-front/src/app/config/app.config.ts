import { ApplicationConfig } from '@angular/core';
import { provideRouter ,withComponentInputBinding,withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from '../routes/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient , withJsonpSupport } from '@angular/common/http';



export const appConfig: ApplicationConfig = {
  providers: [provideRouter(
    routes,
    withViewTransitions(),
    withComponentInputBinding(),
    withInMemoryScrolling({scrollPositionRestoration: 'enabled'})),
    provideAnimations(),
    provideHttpClient(withJsonpSupport()),]
};

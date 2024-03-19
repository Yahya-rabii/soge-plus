import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient, OAuthService, AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig : AuthConfig = {
    issuer: "http://localhost:8080/realms/AppCC-realm",
    tokenEndpoint: "http://localhost:8080/realms/AppCC-realm/protocol/openid-connect/auth",
    clientId: "AppCC-client",
    redirectUri: window.location.origin,
    responseType: "code",
    scope: "openid profile email",
    // i need both the client id and the secret to get the token
    dummyClientSecret: "2daZvH7aBBVcwI9mvJw3dPQMwWUiZhVK",
  };

  function initialzeOauth(oauthService: OAuthService) : Promise<void> {
    return new Promise((resolve) => {
      oauthService.configure(authCodeFlowConfig);
      oauthService.setupAutomaticSilentRefresh();
      oauthService.loadDiscoveryDocumentAndLogin().then(() => resolve());
      }
    );
    
  }

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              provideHttpClient(),
              provideOAuthClient(),
              {
                provide: APP_INITIALIZER,
                useFactory: (oauthService: OAuthService) => {
                  return () => {
                    initialzeOauth(oauthService);
                  }
                },
              multi : true,
              deps: [OAuthService]
              }      
  ]
};

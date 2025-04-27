import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { tokenInterceptor } from './auth/interceptors/token.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { AuthEffects } from './store/effects/auth.effects';
// import { reducers } from './store';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/reducers/auth.reducers';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideAnimationsAsync(),
    importProvidersFrom(StoreModule.forRoot({ auth: authReducer })),
    importProvidersFrom(
      EffectsModule.forRoot([AuthEffects])  
    ),
  ],
};

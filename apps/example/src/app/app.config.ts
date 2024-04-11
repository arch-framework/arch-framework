import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideClientHydration} from '@angular/platform-browser';

import {appRoutes} from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [provideClientHydration(), provideRouter(appRoutes)],
};

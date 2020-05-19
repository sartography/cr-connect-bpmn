import {AppEnvironment} from 'sartography-workflow-lib';

declare var ENV;

export const _has = (env, key, temp): boolean => env && ![null, undefined, temp, ''].includes(env[key]);

export const environment: AppEnvironment = {
  homeRoute: _has(ENV, 'homeRoute', '$HOME_ROUTE') ? ENV.homeRoute : 'home',
  production: _has(ENV, 'production', '$PRODUCTION') ? (ENV.production === 'true') : false,
  api: _has(ENV, 'api', '$API_URL') ? ENV.api : 'http://localhost:5000/v1.0',
  irbUrl: _has(ENV, 'irbUrl', '$IRB_URL') ? ENV.irbUrl : 'http://localhost:5001',
};

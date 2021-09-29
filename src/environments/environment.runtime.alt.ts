import {AppEnvironment} from 'sartography-workflow-lib';

declare let ENV;

export const _has = (env, key, temp): boolean => env && ![null, undefined, temp, ''].includes(env[key]);

export const environment: AppEnvironment = {
  homeRoute: _has(ENV, 'homeRoute', '$HOME_ROUTE') ? ENV.homeRoute : 'home',
  production: _has(ENV, 'production', '$PRODUCTION') ? (ENV.production === 'true') : false,
  api: _has(ENV, 'api', '$API_URL') ? ENV.api : 'http://localhost:7000/v1.0',
  irbUrl: _has(ENV, 'irbUrl', '$IRB_URL') ? ENV.irbUrl : 'http://localhost:7001',
  title: _has(ENV, 'title', '$TITLE') ? ENV.title : 'Research Ramp-Up Toolkit Configurator',
  googleAnalyticsKey: _has(ENV, 'googleAnalyticsKey', '$GOOGLE_ANALYTICS_KEY') ? ENV.googleAnalyticsKey : 'UA-168203235-5',
  sentryKey: _has(ENV, 'sentryKey', '$SENTRY_KEY') ? ENV.sentryKey : undefined,
};

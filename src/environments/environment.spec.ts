import {_has, environment} from './environment.runtime';

declare var ENV;

describe('Environments', () => {
  it('should have default values for all the environments', () => {
    expect(environment).toBeDefined();
    expect(environment.production).toEqual(false);
    expect(environment.api).toEqual('apiRoot');
    expect(environment.irbUrl).toEqual('irbUrl');
    expect(environment.homeRoute).toEqual('home');
    expect(environment.title).toEqual('Research Ramp-Up Toolkit');
    expect(environment.googleAnalyticsKey).toEqual('UA-168203235-5');
    expect(environment.sentryKey).toEqual(undefined);
  });

  it('should check if environment variables are defined', () => {
    const env = {
      homeRoute: '$HOME_ROUTE',
      production: '$PRODUCTION',
      api: '$API_URL',
      irbUrl: '$IRB_URL',
      title: '$TITLE',
      googleAnalyticsKey: '$GOOGLE_ANALYTICS_KEY',
      sentryKey: '$SENTRY_KEY',
    };

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeFalse();
    expect(_has(env, 'production', '$PRODUCTION')).toBeFalse();
    expect(_has(env, 'api', '$API_URL')).toBeFalse();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeFalse();
    expect(_has(env, 'title', '$TITLE')).toBeFalse();
    expect(_has(env, 'googleAnalyticsKey', '$GOOGLE_ANALYTICS_KEY')).toBeFalse();

    env.homeRoute = undefined;
    env.production = undefined;
    env.api = undefined;
    env.irbUrl = undefined;
    env.title = undefined;
    env.googleAnalyticsKey = undefined;

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeFalse();
    expect(_has(env, 'production', '$PRODUCTION')).toBeFalse();
    expect(_has(env, 'api', '$API_URL')).toBeFalse();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeFalse();
    expect(_has(env, 'title', '$TITLE')).toBeFalse();
    expect(_has(env, 'googleAnalyticsKey', '$GOOGLE_ANALYTICS_KEY')).toBeFalse();

    env.homeRoute = 'something';
    env.production = 'something';
    env.api = 'something';
    env.irbUrl = 'something';
    env.title = 'something';
    env.googleAnalyticsKey = 'something';

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeTrue();
    expect(_has(env, 'production', '$PRODUCTION')).toBeTrue();
    expect(_has(env, 'api', '$API_URL')).toBeTrue();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeTrue();
    expect(_has(env, 'title', '$TITLE')).toBeTrue();
    expect(_has(env, 'googleAnalyticsKey', '$GOOGLE_ANALYTICS_KEY')).toBeTrue();
  });
});

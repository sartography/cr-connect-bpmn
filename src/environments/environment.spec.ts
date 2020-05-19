import {_has, environment} from './environment.runtime';

declare var ENV;

describe('Environments', () => {
  it('should have settings for all the environments', () => {
    expect(environment).toBeDefined();
    expect(environment.production).toEqual(false);
    expect(environment.api).toEqual('apiRoot');
    expect(environment.irbUrl).toEqual('irbUrl');
    expect(environment.homeRoute).toEqual('home');
  });

  it('should check if environment variables are defined', () => {
    const env = {
      homeRoute: '$HOME_ROUTE',
      production: '$PRODUCTION',
      api: '$API_URL',
      irbUrl: '$IRB_URL',
    };

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeFalse();
    expect(_has(env, 'production', '$PRODUCTION')).toBeFalse();
    expect(_has(env, 'api', '$API_URL')).toBeFalse();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeFalse();

    env.homeRoute = undefined;
    env.production = undefined;
    env.api = undefined;
    env.irbUrl = undefined;

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeFalse();
    expect(_has(env, 'production', '$PRODUCTION')).toBeFalse();
    expect(_has(env, 'api', '$API_URL')).toBeFalse();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeFalse();

    env.homeRoute = 'something';
    env.production = 'something';
    env.api = 'something';
    env.irbUrl = 'something';

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeTrue();
    expect(_has(env, 'production', '$PRODUCTION')).toBeTrue();
    expect(_has(env, 'api', '$API_URL')).toBeTrue();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeTrue();
  });
});

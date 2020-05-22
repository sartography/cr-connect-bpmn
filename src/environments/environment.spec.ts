import {AppEnvironment} from 'sartography-workflow-lib';
import {_has, environment} from './environment.runtime';

declare var ENV;

describe('Environments', () => {
  it('should have settings for all the environments', () => {
    expect(environment).toBeDefined();
    expect(environment.production).toEqual(false);
    expect(environment.api).toEqual('apiRoot');
    expect(environment.irbUrl).toEqual('irbUrl');
    expect(environment.homeRoute).toEqual('home');
    expect(environment.baseHref).toEqual('/');
  });

  it('should check if environment variables are defined', () => {
    const env = {
      homeRoute: '$HOME_ROUTE',
      production: '$PRODUCTION',
      api: '$API_URL',
      irbUrl: '$IRB_URL',
      baseHref: '$BASE_HREF',
    };

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeFalse();
    expect(_has(env, 'production', '$PRODUCTION')).toBeFalse();
    expect(_has(env, 'api', '$API_URL')).toBeFalse();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeFalse();
    expect(_has(env, 'baseHref', '$BASE_HREF')).toBeFalse();

    env.homeRoute = undefined;
    env.production = undefined;
    env.api = undefined;
    env.irbUrl = undefined;
    env.baseHref = undefined;

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeFalse();
    expect(_has(env, 'production', '$PRODUCTION')).toBeFalse();
    expect(_has(env, 'api', '$API_URL')).toBeFalse();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeFalse();
    expect(_has(env, 'baseHref', '$BASE_HREF')).toBeFalse();

    env.homeRoute = 'something';
    env.production = 'something';
    env.api = 'something';
    env.irbUrl = 'something';
    env.baseHref = 'something';

    expect(_has(env, 'homeRoute', '$HOME_ROUTE')).toBeTrue();
    expect(_has(env, 'production', '$PRODUCTION')).toBeTrue();
    expect(_has(env, 'api', '$API_URL')).toBeTrue();
    expect(_has(env, 'irbUrl', '$IRB_URL')).toBeTrue();
    expect(_has(env, 'baseHref', '$BASE_HREF')).toBeTrue();
  });
});

import {environment} from './environment.runtime';


describe('Environments', () => {
  it('should have settings for all the environments', () => {
    expect(environment).toBeDefined();
    expect(environment.production).toEqual(false);
    expect(environment.api).toEqual('apiRoot');
    expect(environment.irbUrl).toEqual('irbUrl');
  });
});

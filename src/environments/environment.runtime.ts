import {AppEnvironment} from 'sartography-workflow-lib';

declare var ENV;

export const environment: AppEnvironment = {
  production: ENV && ENV.production === '{$PRODUCTION}' ? false : (ENV.production === 'true'),
  api: ENV && ENV.api === '{$API_URL}' ? 'http://localhost:5000/v1.0' : ENV.api,
  irbUrl: ENV && ENV.irbUrl === '{$IRB_URL}' ? 'http://localhost:5001' : ENV.irbUrl,
};

import {AppEnvironment} from 'sartography-workflow-lib';

declare var ENV;

const envHas = (key, temp): boolean => (ENV && (ENV[key] !== null) && (ENV[key] !== undefined) && (ENV[key] !== temp));

export const environment: AppEnvironment = {
  homeRoute: envHas('homeRoute', '$HOME_ROUTE') ? ENV.homeRoute : 'home',
  production: envHas('production', '$PRODUCTION') ? (ENV.production === 'true') : false,
  api: envHas('api', '$API_URL') ? ENV.api : 'http://localhost:5000/v1.0',
  irbUrl: envHas('irbUrl', '$IRB_URL') ? ENV.irbUrl : 'http://localhost:5001',
};




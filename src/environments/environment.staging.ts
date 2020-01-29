import {AppEnvironment} from 'sartography-workflow-lib/lib/types/app-environment';

export const environment: AppEnvironment = {
  production: true,
  api: 'http://workflow.sartography.com:5000/v1.0',
  googleAnalyticsKey: '',
  irbUrl: 'https://workflow.sartography.com:5001/pb/ui',
};

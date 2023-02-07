import {
  DmnPropertiesProviderModule,
  DmnPropertiesPanelModule
} from 'dmn-js-properties-panel';
import * as camundaModdleDescriptor from 'camunda-dmn-moddle/resources/camunda.json';
import {ModelerConfig} from '../_interfaces/modeler-config';

export const dmnModelerConfig: ModelerConfig = {
  additionalModules: [
    DmnPropertiesProviderModule,
    DmnPropertiesPanelModule,
//    drdAdapterModule,
  ],
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
};

import * as camundaModdleDescriptor from 'camunda-dmn-moddle/resources/camunda.json';
import propertiesPanelModule from 'dmn-js-properties-panel';
import drdAdapterModule from 'dmn-js-properties-panel/lib/adapter/drd';
import propertiesProviderModule from 'dmn-js-properties-panel/lib/provider/camunda';
import {ModelerConfig} from '../_interfaces/modeler-config';

export const dmnModelerConfig: ModelerConfig = {
  additionalModules: [
    propertiesProviderModule,
    propertiesPanelModule,
    drdAdapterModule,
  ],
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
};

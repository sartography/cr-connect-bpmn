import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
// use Camunda Platform properties provider

import * as camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import minimapModule from 'diagram-js-minimap';
import codeModule from 'diagram-js-code-editor';
import {ModelerConfig} from '../_interfaces/modeler-config';

export const bpmnModelerConfig: ModelerConfig = {
  additionalModules: [
     BpmnPropertiesPanelModule,
     BpmnPropertiesProviderModule,
     CamundaPlatformPropertiesProviderModule,
//     CamundaExtensionModule,
     minimapModule,
     codeModule,
  ],
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
};

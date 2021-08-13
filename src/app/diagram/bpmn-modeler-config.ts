import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import * as bpmnModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import minimapModule from 'diagram-js-minimap';
import codeModule from 'diagram-js-code-editor';
import {ModelerConfig} from '../_interfaces/modeler-config';

export const bpmnModelerConfig: ModelerConfig = {
  additionalModules: [
    propertiesProviderModule,
    propertiesPanelModule,
    minimapModule,
    codeModule,
  ],
  moddleExtensions: {
    camunda: bpmnModdleDescriptor
  }
};

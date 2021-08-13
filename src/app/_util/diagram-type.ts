import { FileType } from 'sartography-workflow-lib';

export const getDiagramTypeFromXml = (xml: string): FileType => {
  return (xml && /dmn\.xsd|dmndi:DMNDiagram/.test(xml) ? FileType.DMN : FileType.BPMN);
};

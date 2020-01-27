import {FileType} from 'sartography-workflow-lib';

export const getDiagramTypeFromXml = (xml: string): FileType => {
  return (xml && xml.includes('dmn.xsd') ? FileType.DMN : FileType.BPMN);
};

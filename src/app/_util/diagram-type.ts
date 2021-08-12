import { FileType } from 'sartography-workflow-lib';

export const getDiagramTypeFromXml = (xml: string): FileType => (xml && xml.includes('dmndi:DMNDiagram') ? FileType.DMN : FileType.BPMN);

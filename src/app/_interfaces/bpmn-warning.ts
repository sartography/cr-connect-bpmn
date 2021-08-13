export interface BpmnError {
  warnings: BpmnWarning[];
}

export interface BpmnWarning {
  message?: string;
  element?: any;
  property?: string;
  value?: string;
  context?: any;
  error?: Error;
}

import {FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';

export interface FileMetaDialogData {
  fileName: string;
  fileType: FileType;
}

export interface NewFileDialogData {
  fileType: FileType;
}

export interface OpenFileDialogData {
  file: File;
}

export interface WorkflowSpecDialogData {
  id: string;
  name: string;
  display_name: string;
  description: string;
}

export interface DeleteFileDialogData {
  confirm: boolean;
  fileMeta: FileMeta;
}

export interface DeleteWorkflowSpecDialogData {
  confirm: boolean;
  workflowSpec: WorkflowSpec;
}

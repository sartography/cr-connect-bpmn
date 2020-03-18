import {FileMeta, FileType, WorkflowSpec, WorkflowSpecCategory} from 'sartography-workflow-lib';

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
  workflow_spec_category_id: number;
}

export interface WorkflowSpecCategoryDialogData {
  id: number;
  name: string;
  display_name: string;
}

export interface DeleteFileDialogData {
  confirm: boolean;
  fileMeta: FileMeta;
}

export interface DeleteWorkflowSpecDialogData {
  confirm: boolean;
  workflowSpec: WorkflowSpec;
}

export interface DeleteWorkflowSpecCategoryDialogData {
  confirm: boolean;
  category: WorkflowSpecCategory;
}

import {FileMeta, FileType, WorkflowSpec, WorkflowSpecCategory} from 'sartography-workflow-lib';
import {ApiError} from 'sartography-workflow-lib/lib/types/api';

export interface FileMetaDialogData {
  id?: number;
  fileName: string;
  fileType: FileType;
  file?: File;
}

export interface NewFileDialogData {
  fileType: FileType;
}

export interface OpenFileDialogData {
  fileMetaId?: number;
  file: File;
  mode?: string;
  fileTypes?: FileType[];
}

export interface WorkflowSpecDialogData {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category_id: number;
  display_order: number;
}

export interface WorkflowSpecCategoryDialogData {
  id: number;
  name: string;
  display_name: string;
  display_order?: number;
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

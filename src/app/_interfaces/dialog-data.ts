import {FileMeta, FileType, WorkflowSpec, WorkflowSpecCategory} from 'sartography-workflow-lib';

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
  display_name: string;
  description: string;
  category_id: string;
  display_order: number;
  standalone: boolean;
  library: boolean;
}

export interface WorkflowSpecCategoryDialogData {
  id: string;
  display_name: string;
  display_order?: number;
  admin: boolean;
}

export interface DeleteFileDialogData {
  confirm: boolean;
  fileMeta: FileMeta;
}

export interface ConfirmDialogData {
    title: string;
    message: string;
}



export interface DeleteWorkflowSpecDialogData {
  confirm: boolean;
  workflowSpec: WorkflowSpec;
}

export interface DeleteWorkflowSpecCategoryDialogData {
  confirm: boolean;
  category: WorkflowSpecCategory;
}

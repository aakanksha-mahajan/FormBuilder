// Instruction Types
export type InstructionType = "text" | "image" | "video" | "link";

export interface Instruction {
  type: InstructionType;
  value: string;
  label?: string;
  altText?: string;
}

// Field Types
export type FieldType =
  | "text"
  | "dropdown"
  | "checkbox"
  | "file"
  | "buttonGroup"
  | "time"
  | "radio";

// Validation
export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  regex?: string;
  mustBeTrue?: boolean;
  errorMessage?: string;
}

// Options (for dropdown / radio)
export interface FieldOption {
  label: string;
  value: string;
}

// File config
export interface FileConfig {
  allowedTypes: string[];
  maxSizeMB: number;
}

// Button config
export interface ActionButton {
  label: string;
  action: "SAVE_DRAFT" | "SUBMIT";
  primary?: boolean;
}

// Field Interface
export interface Field {
  id: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  mandatory?: boolean;
  options?: FieldOption[];
  validation?: ValidationRule;
  fileConfig?: FileConfig;
  buttons?: ActionButton[];
}

// Form Meta
export interface FormMeta {
  formId: string;
  formName: string;
  version: string;
  submitButtonText: string;
  resetButtonText: string;
}

// Submission
export interface SubmissionConfig {
  apiEndpoint: string;
  method: "POST" | "PUT";
}

// Success / Failure
export interface ResponseConfig {
  type: "toast" | "dialog";
  title?: string;
  message: string;
  redirect?: {
    type: "route";
    value: string;
  };
}

// Main Form Schema
export interface FormSchema {
  formMeta: FormMeta;
  instructions: Instruction[];
  fields: Field[];
  submission: SubmissionConfig;
  successResponse: ResponseConfig;
  failureResponse: ResponseConfig;
}

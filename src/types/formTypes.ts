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
  | "radio"
  | "textarea"
  | "date";

// Validation
export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  regex?: string;
  mustBeTrue?: boolean;
  minDate?: string;
  maxDate?: string;
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
  multiple?: boolean;
  maxFiles?: number;
}

// Button config
export interface ActionButton {
  label: string;
  action: "SAVE_DRAFT" | "SUBMIT" | "NEXT" | "PREV" | "BACK" | "REDIRECT" | "DOWNLOAD_PDF" | "CANCEL"   ;
  primary?: boolean;
  value?: string;
}

// Navigation Config
export interface NavigationConfig {
  prevButton?: ActionButton;
  nextButton?: ActionButton;
  submitButton?: ActionButton;
}

// Review Config
export interface ReviewConfig {
  showAllFields?: boolean;
  editableSteps?: boolean;
  groupByStep?: boolean;
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
  layout?: "horizontal" | "vertical";
  searchable?: boolean;
}

// Form Step
export interface FormStep {
  stepId: string;
  stepName?: string;
  stepTitle?: string;
  stepDescription?: string;
  icon?: string;
  type?: "review";
  reviewConfig?: ReviewConfig;
  fields: Field[];
  navigation?: NavigationConfig;
}

// Form Meta
export interface FormMeta {
  formId: string;
  formName: string;
  version: string;
  type?: "single" | "stepper";
  submitButtonText?: string;
  resetButtonText?: string;
  stepperConfig?: {
    orientation?: "horizontal" | "vertical";
    showStepNumbers?: boolean;
    allowSkip?: boolean;
    allowJumpToStep?: boolean;
    showProgressBar?: boolean;
    validateBeforeNext?: boolean;
  };
}

// Submission
export interface SubmissionConfig {
  apiEndpoint: string;
  method: "POST" | "PUT";
  includeStepData?: boolean;
  saveDraftEndpoint?: string;
  autoSaveDraft?: boolean;
  autoSaveIntervalSeconds?: number;
}

// Success / Failure
export interface ResponseConfig {
  type: "toast" | "dialog" | "screen";
  title?: string;
  message: string;
  icon?: string;
  actions?: ActionButton[];
  retryButton?: boolean;
  redirect?: {
    type: "route";
    value: string;
  };
}

// Main Form Schema
export interface FormSchema {
  formMeta: FormMeta;
  instructions?: Instruction | Instruction[];
  fields?: Field[];
  steps?: FormStep[];
  submission: SubmissionConfig;
  successResponse: ResponseConfig;
  failureResponse: ResponseConfig;
  stepMeta?: {
    isFinalStep?: boolean;
  };
}

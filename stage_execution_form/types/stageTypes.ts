export type SectionType = "document_group" | "requirements" | "checklist" | "textarea";

export interface DocumentItem {
  id: string;
  label: string;
  fileType: string;
  required: boolean;
}

export interface RequirementItem {
  id: string;
  label: string;
  type: "checkbox";
  required: boolean;
  status: string;
}

export interface ChecklistItem {
  id: string;
  question: string;
  required: boolean;
  response: {
    status: string;
    comment: string;
    completedAt: string;
  } | null;
  evidence: EvidenceItem[]; 
}

export interface EvidenceItem {
  fileName: string;
  fileSizeKB: number;
  uploadedAt: string;
  url: string;
}

// Discriminated Union for Sections
export interface DocumentSection {
  id: string;
  type: "document_group";
  title: string;
  items: DocumentItem[];
}

export interface RequirementsSection {
  id: string;
  type: "requirements";
  title: string;
  items: RequirementItem[];
}

export interface ChecklistSection {
  id: string;
  type: "checklist";
  title: string;
  items: ChecklistItem[];
}

export interface NotesSection {
  id: string;
  type: "textarea";
  title: string;
  description: string;
  value: string;
  readonly: boolean;
}

export type FormSection = 
  | DocumentSection 
  | RequirementsSection 
  | ChecklistSection 
  | NotesSection;

export interface StageJSON {
  formId: string;
  formType: string;
  version: string;
  status: string;
  locked: boolean;
  context: {
    product: string;
    workOrderId: string;
    stageNumber: number;
    totalStages: number;
  };
  header: {
    title: string;
    description: string;
    operator: { type: string; value: string };
    startedAt: string;
  };
  sections: FormSection[];
  audit: {
    createdBy: string;
    createdAt: string;
    lastUpdatedAt: string;
  };
}
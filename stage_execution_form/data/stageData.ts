import type { StageJSON } from "../types/stageTypes";

export const stageExecutionData: StageJSON = {
  formId: "vi-stage-1",
  formType: "stage_execution",
  version: "1.0.0",
  status: "in_progress",
  locked: false,

  context: {
    product: "Vacuum Interruptor",
    workOrderId: "WO-145",
    stageNumber: 1,
    totalStages: 8
  },

  header: {
    title: "Prepare and verify all materials required for assembly",
    description: "Check inventory levels and quality certificates.",
    operator: {
      type: "user",
      value: "Sarah Johnson"
    },
    startedAt: "2026-01-10T06:00:00Z"
  },

  sections: [
    {
      id: "reference_documents",
      type: "document_group",
      title: "Reference Documents & Drawings",
      items: [
        {
          id: "bom",
          label: "Bill of Materials (BOM)",
          fileType: "excel",
          required: true
        },
        {
          id: "reference_image",
          label: "Reference Image",
          fileType: "image",
          required: false
        }
      ]
    },
    {
      id: "stage_requirements",
      type: "requirements",
      title: "Stage-Specific Requirements",
      items: [
        {
          id: "bom_signoff",
          label: "BOM Signoff",
          type: "checkbox",
          required: true,
          status: "PENDING"
        }
      ]
    },
    {
      id: "quality_checklist",
      type: "checklist",
      title: "Quality Checklist",
      items: [
        {
          id: "qc_01",
          question: "Housings and supports are taped over openings",
          required: true,
          response: null,
          evidence: []
        },
        {
          id: "qc_02",
          question: "Spring serial numbers are written on tape and attached to each spring",
          required: true,
          response: null,
          evidence: []
        }
      ]
    },
    {
      id: "additional_notes",
      type: "textarea",
      title: "Additional Notes",
      description: "Add any additional observations, issues, or notes about this stage.",
      value: "",
      readonly: false
    }
  ],

  audit: {
    createdBy: "system",
    createdAt: "2026-01-10T06:00:00Z",
    lastUpdatedAt: "2026-01-10T06:00:00Z"
  }
};
import type { FormSchema } from "../types/formTypes";

export const formJson: FormSchema = {
  formMeta: {
    formId: "EMPLOYEE_ONBOARDING_001",
    formName: "Employee Onboarding",
    version: "1.0",
    type: "stepper",
    stepperConfig: {
      orientation: "horizontal",
      showStepNumbers: true,
      allowSkip: false,
      allowJumpToStep: false,
      showProgressBar: true,
      validateBeforeNext: true,
    },
  },
  instructions: {
    type: "text",
    value: "Complete all steps to finish your onboarding process.",
  },
  steps: [
    {
      stepId: "personal_info",
      stepName: "Personal Information",
      stepDescription: "Basic details about yourself",
      icon: "person",
      fields: [
        {
          id: "firstName",
          type: "text",
          label: "First Name",
          placeholder: "Enter first name",
          mandatory: true,
          validation: {
            minLength: 2,
            maxLength: 30,
            regex: "^[a-zA-Z]+$",
            errorMessage: "First Name should contain only letters",
          },
        },

        {
          id: "lastName",
          type: "text",
          label: "Last Name",
          placeholder: "Enter last name",
          mandatory: false,
          validation: {
            minLength: 2,
            maxLength: 30,
            regex: "^[a-zA-Z]+$",
            errorMessage: "Last Name should contain only letters",
          },
        },
        {
          id: "dob",
          type: "date",
          label: "Date of Birth",
          mandatory: true,
          validation: {
            minDate: "1950-01-01",
            maxDate: "2005-12-31",
            errorMessage: "You must be at least 18 years old",
          },
        },
        {
          id: "gender",
          type: "radio",
          label: "Gender",
          mandatory: true,
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ],
          layout: "horizontal",
        },
      ],
      navigation: {
        nextButton: { label: "Continue", action: "NEXT" },
      },
    },
    {
      stepId: "contact_details",
      stepName: "Contact Details",
      stepDescription: "How can we reach you?",
      icon: "phone",
      fields: [
        {
          id: "email",
          type: "text",
          label: "Email Address",
          placeholder: "you@example.com",
          mandatory: true,
          validation: {
            regex: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
            errorMessage: "Enter a valid email",
          },
        },
        {
          id: "phone",
          type: "text",
          label: "Phone Number",
          placeholder: "10 digits only",
          mandatory: true,
          validation: {
            minLength: 10,
            maxLength: 10,
            regex: "^[0-9]{10}$",
            errorMessage: "Phone number must be exactly 10 digits",
          },
        },
        {
          id: "country",
          type: "dropdown",
          label: "Country",
          mandatory: true,
          options: [
            { label: "India", value: "IN" },
            { label: "United States", value: "US" },
            { label: "Germany", value: "DE" },
            { label: "Other", value: "OTHER" },
          ],
          searchable: true,
        },
        {
          id: "address",
          type: "textarea",
          label: "Address",
          placeholder: "Enter your full address",
          mandatory: false,
          validation: {
            maxLength: 200,
          },
        },
      ],
      navigation: {
        prevButton: { label: "Back", action: "PREV" },
        nextButton: { label: "Continue", action: "NEXT" },
      },
    },
    {
      stepId: "documents",
      stepName: "Documents",
      stepDescription: "Upload required documents",
      icon: "upload",
      fields: [
        {
          id: "idProof",
          type: "file",
          label: "ID Proof (Aadhaar/Passport)",
          mandatory: true,
          fileConfig: {
            allowedTypes: ["pdf", "jpg", "png"],
            maxSizeMB: 5,
            multiple: false,
          },
          validation: {
            errorMessage: "Please upload a valid ID proof",
          },
        },
        {
          id: "profilePhoto",
          type: "file",
          label: "Profile Photo",
          mandatory: true,
          fileConfig: {
            allowedTypes: ["jpg", "png"],
            maxSizeMB: 2,
            multiple: false,
          },
        },
        {
          id: "additionalDocs",
          type: "file",
          label: "Additional Documents (Optional)",
          mandatory: false,
          fileConfig: {
            allowedTypes: ["pdf", "jpg", "png", "doc", "docx"],
            maxSizeMB: 10,
            multiple: true,
            maxFiles: 5,
          },
        },
      ],
      navigation: {
        prevButton: { label: "Back", action: "PREV" },
        nextButton: { label: "Review & Submit", action: "NEXT" },
      },
    },
    {
      stepId: "review",
      stepName: "Review & Confirm",
      stepDescription: "Review your information before submitting",
      icon: "check",
      type: "review",
      reviewConfig: {
        showAllFields: true,
        editableSteps: true,
        groupByStep: true,
      },
      fields: [
        {
          id: "termsAccepted",
          type: "checkbox",
          label: "I confirm that all information provided is accurate",
          mandatory: true,
          validation: {
            mustBeTrue: true,
            errorMessage: "You must confirm before submitting",
          },
        },
      ],
      navigation: {
        prevButton: { label: "Back", action: "PREV" },
        submitButton: {
          label: "Submit Application",
          action: "SUBMIT",
          primary: true,
        },
      },
    },
  ],
  submission: {
    apiEndpoint: "/api/onboarding/submit",
    method: "POST",
    includeStepData: true,
    saveDraftEndpoint: "/api/onboarding/draft",
    autoSaveDraft: true,
    autoSaveIntervalSeconds: 30,
  },
  successResponse: {
    type: "screen",
    title: "Application Submitted!",
    message:
      "Your onboarding application has been received. You will receive a confirmation email shortly.",
    icon: "success",
    actions: [
      { label: "Go to Dashboard", action: "REDIRECT", value: "/dashboard" },
      { label: "Download Copy", action: "DOWNLOAD_PDF" },
    ],
  },
  failureResponse: {
    type: "dialog",
    title: "Submission Failed",
    message: "Something went wrong. Please try again.",
    retryButton: true,
  },
};

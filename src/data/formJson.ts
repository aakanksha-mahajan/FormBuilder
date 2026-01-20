import type { FormSchema } from "../types/formTypes";

export const formJson: FormSchema = {
    formMeta: {
        formId: "USER_KYC_FORM_001",
        formName: "User KYC Verification",
        version: "1.0",
        submitButtonText: "Submit",
        resetButtonText: "Reset",
    },

    instructions: [
        {
            type: "text",
            value: "Please complete the KYC form. All mandatory fields must be filled.",
        },
        {
            type: "image",
            value: "https://example.com/images/kyc-info.png",
            altText: "KYC Information",
        },
        {
            type: "video",
            value: "https://example.com/videos/kyc-guide.mp4",
        },
        {
            type: "link",
            label: "View KYC Guidelines",
            value: "https://example.com/kyc-guidelines",
        },
    ],

    fields: [
        {
            id: "fullName",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            mandatory: true,
            validation: {
                minLength: 3,
                maxLength: 50,
                regex: "^[a-zA-Z ]+$",
                errorMessage: "Name should contain only alphabets and spaces",
            },
        },

        {
            id: "email",
            type: "text",
            label: "Email Address",
            placeholder: "Enter your email",
            mandatory: true,
            validation: {
                regex: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
                errorMessage: "Enter a valid email address",
            },
        },

        {
            id: "gender",
            type: "dropdown",
            label: "Gender",
            mandatory: true,
            options: [
                { label: "Male", value: "M" },
                { label: "Female", value: "F" },
                { label: "Other", value: "O" },
            ],
            validation: {
                errorMessage: "Please select a gender",
            },
        },

        {
            id: "startTime",
            type: "time",
            label: "Start Time",
            mandatory: true,
        },

        {
            id: "stopTime",
            type: "time",
            label: "Stop Time",
            mandatory: true,
        },

        {
            id: "calculatedTime",
            type: "text",
            label: "Calculated Duration",
            placeholder: "Time difference will appear here",
            mandatory: false,
        },

        {
            id: "testResult",
            type: "radio",
            label: "Test Result",
            mandatory: true,
            options: [
                { label: "Pass", value: "pass" },
                { label: "Fail", value: "fail" },
            ],
            validation: {
                errorMessage: "Please select a test result",
            },
        },

        {
            id: "agreeTerms",
            type: "checkbox",
            label: "I agree to the Terms & Conditions",
            mandatory: true,
            validation: {
                mustBeTrue: true,
                errorMessage: "You must agree before submitting",
            },
        },

        {
            id: "identityProof",
            type: "file",
            label: "Upload ID Proof",
            mandatory: true,
            fileConfig: {
                allowedTypes: ["pdf", "jpg", "png"],
                maxSizeMB: 5,
            },
            validation: {
                errorMessage:
                    "Upload a valid ID proof (PDF/JPG/PNG, max 5MB)",
            },
        },

        {
            id: "actionButtons",
            type: "buttonGroup",
            buttons: [
                { label: "Save Draft", action: "SAVE_DRAFT" },
                { label: "Submit", action: "SUBMIT", primary: true },
            ],
        },
    ],

    submission: {
        apiEndpoint: "/api/kyc/submit",
        method: "POST",
    },

    successResponse: {
        type: "toast",
        message: "KYC submitted successfully!",
        redirect: {
            type: "route",
            value: "/kyc/success",
        },
    },

    failureResponse: {
        type: "dialog",
        title: "Submission Failed",
        message:
            "There was an error submitting the form. Please try again later.",
    },
};

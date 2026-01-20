import type { Field } from "../../../types/formTypes";

export const validateField = (field: Field, value: any): string => {
  // Mandatory check
  if (field.mandatory) {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === false
    ) {
      return field.validation?.errorMessage || "This field is required";
    }
  }

  // Time validation (HH:MM 24-hour) when a value is present
  if (field.type === "time" && value) {
    if (typeof value !== "string") {
      return field.validation?.errorMessage || "Invalid time";
    }
    const match = value.match(/^(\d{2}):(\d{2})$/);
    if (!match) {
      return field.validation?.errorMessage || "Invalid time format";
    }
    const hh = Number(match[1]);
    const mm = Number(match[2]);
    if (
      Number.isNaN(hh) ||
      Number.isNaN(mm) ||
      hh < 0 ||
      hh > 23 ||
      mm < 0 ||
      mm > 59
    ) {
      return field.validation?.errorMessage || "Invalid time";
    }
  }

  // Regex validation
  if (field.validation?.regex && value) {
    const regex = new RegExp(field.validation.regex);
    if (!regex.test(value)) {
      return field.validation.errorMessage || "Invalid format";
    }
  }

  // Min length
  if (
    field.validation?.minLength &&
    value &&
    value.length < field.validation.minLength
  ) {
    return `Minimum ${field.validation.minLength} characters required`;
  }

  // Max length
  if (
    field.validation?.maxLength &&
    value &&
    value.length > field.validation.maxLength
  ) {
    return `Maximum ${field.validation.maxLength} characters allowed`;
  }

  // Checkbox must be true
  if (field.validation?.mustBeTrue && value !== true) {
    return field.validation.errorMessage || "This must be checked";
  }

  return "";
};

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
      return field.validation?.errorMessage || "validation.required";
    }
  }

  // If not mandatory and no value, pass validation
  if (!field.mandatory && (value === undefined || value === null || value === "")) {
    return "";
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
      return field.validation?.errorMessage || "validation.invalidTime";
    }
  }

  // Min length check before regex
  if (
    field.validation?.minLength &&
    value &&
    value.length < field.validation.minLength
  ) {
    return `validation.minLength|${field.validation.minLength}`;
  }

  // Max length check
  if (
    field.validation?.maxLength &&
    value &&
    value.length > field.validation.maxLength
  ) {
    return `validation.maxLength|${field.validation.maxLength}`;
  }

  // Regex validation - use field errorMessage if provided
  if (field.validation?.regex && value) {
    const regex = new RegExp(field.validation.regex);
    if (!regex.test(value)) {
      return field.validation.errorMessage || "validation.invalidFormat";
    }
  }

  // Date range validation (minDate, maxDate)
  if (field.type === "date" && value) {
    if (field.validation?.minDate) {
      const minDate = new Date(field.validation.minDate);
      const selectedDate = new Date(value);
      if (selectedDate < minDate) {
        return field.validation.errorMessage || "validation.invalidDate";
      }
    }
    if (field.validation?.maxDate) {
      const maxDate = new Date(field.validation.maxDate);
      const selectedDate = new Date(value);
      if (selectedDate > maxDate) {
        return field.validation.errorMessage || "validation.invalidDate";
      }
    }
  }

  // Checkbox must be true
  if (field.validation?.mustBeTrue && value !== true) {
    return field.validation.errorMessage || "validation.required";
  }

  // File validation (type and size)
  if (field.type === "file" && value) {
    const files = Array.isArray(value) ? value : [value];
    
    // Check max files limit
    if (field.fileConfig?.maxFiles && files.length > field.fileConfig.maxFiles) {
      return `validation.maxFilesExceeded|${field.fileConfig.maxFiles}`;
    }
    
    for (const file of files) {
      if (!file || typeof file !== "object") {
        continue;
      }

      // Check file type
      if (field.fileConfig?.allowedTypes && field.fileConfig.allowedTypes.length > 0) {
        const fileName = file.name || "";
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
        const allowedTypes = field.fileConfig.allowedTypes.map((t: string) => t.toLowerCase());
        
        if (!allowedTypes.includes(fileExtension)) {
          const allowedTypesStr = field.fileConfig.allowedTypes.join(",").toUpperCase();
          return `validation.fileTypeNotAllowed|${allowedTypesStr}`;
        }
      }

      // Check file size
      if (field.fileConfig?.maxSizeMB && file.size) {
        const maxSizeBytes = field.fileConfig.maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          return `validation.fileSizeExceeded|${field.fileConfig.maxSizeMB}`;
        }
      }
    }
  }

  return "";
};

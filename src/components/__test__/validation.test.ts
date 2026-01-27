import { validateField } from "../Form/utils/validation";
import type { Field } from "../../types/formTypes";

/**
 * Helper to create a valid Field object
 */
const createField = (overrides: Partial<Field>): Field => ({
  id: "test-field",
  type: "text",
  mandatory: false,
  ...overrides,
});

describe("validateField", () => {
  it("returns required error when mandatory field is empty", () => {
    const field = createField({
      mandatory: true,
      validation: {
        errorMessage: "validation.required",
      },
    });
    

    expect(validateField(field, "")).toBe("validation.required");
    expect(validateField(field, null)).toBe("validation.required");
    expect(validateField(field, undefined)).toBe("validation.required");
    
  });

  it("returns required error when mandatory field value is false", () => {
  const field = createField({
    mandatory: true,
  });

  expect(validateField(field, false)).toBe("validation.required");
});
it("returns custom error when mandatory field value is false and errorMessage is provided", () => {
  const field = createField({
    mandatory: true,
    validation: {
      errorMessage: "validation.required",
    },
  });
  

  expect(validateField(field, false)).toBe("validation.required");
});



  it("returns empty string when non-mandatory field is empty", () => {
    const field = createField({});

    expect(validateField(field, "")).toBe("");
  });

  describe("Time validation", () => {
    it("passes for valid 24-hour time", () => {
      const field = createField({
        type: "time",
      });

      expect(validateField(field, "23:59")).toBe("");
    });

    it("fails for invalid time format", () => {
      const field = createField({
        type: "time",
        validation: {
          errorMessage: "Invalid time",
        },
      });

      expect(validateField(field, "25:00")).toBe("Invalid time");
      expect(validateField(field, "12:60")).toBe("Invalid time");
      expect(validateField(field, "12")).toBe("Invalid time");
    });
  });

  it("fails when time value is not a string", () => {
      const field = createField({
        type: "time",
      });

      expect(validateField(field, 123)).toBe("Invalid time");
      expect(validateField(field, { time: "12:00" })).toBe("Invalid time");
      expect(validateField(field, ["12:00"])).toBe("Invalid time");
    });

    it("returns custom error message when time value is not a string", () => {
      const field = createField({
        type: "time",
        validation: {
          errorMessage: "Custom time error",
        },
      });

      expect(validateField(field, 123)).toBe("Custom time error");
    });

  describe("Min / Max length validation", () => {
    const field = createField({
      validation: {
        minLength: 3,
        maxLength: 5,
      },
    });

    it("fails when value is shorter than minLength", () => {
      expect(validateField(field, "ab")).toBe("validation.minLength|3");
    });

    it("fails when value exceeds maxLength", () => {
      expect(validateField(field, "abcdef")).toBe("validation.maxLength|5");
    });

    it("passes when value length is valid", () => {
      expect(validateField(field, "abcd")).toBe("");
    });
  });

  describe("Regex validation", () => {
    const field = createField({
      validation: {
        regex: "^[0-9]+$",
        errorMessage: "validation.invalidFormat",
      },
    });

    it("fails when regex does not match", () => {
      expect(validateField(field, "abc")).toBe("validation.invalidFormat");
    });

    it("passes when regex matches", () => {
      expect(validateField(field, "123")).toBe("");
    });
  });

  describe("Date range validation", () => {
    const field = createField({
      type: "date",
      validation: {
        minDate: "2024-01-01",
        maxDate: "2024-12-31",
      },
    });

    it("fails when date is before minDate", () => {
      expect(validateField(field, "2023-12-31")).toBe("validation.invalidDate");
    });

    it("fails when date is after maxDate", () => {
      expect(validateField(field, "2025-01-01")).toBe("validation.invalidDate");
    });

    it("passes for valid date range", () => {
      expect(validateField(field, "2024-06-01")).toBe("");
    });
  });

  describe("Checkbox mustBeTrue validation", () => {
    const field = createField({
      type: "checkbox",
      validation: {
        mustBeTrue: true,
      },
    });

    it("fails when checkbox is false", () => {
      expect(validateField(field, false)).toBe("validation.required");
    });

    it("passes when checkbox is true", () => {
      expect(validateField(field, true)).toBe("");
    });
  });

  describe("File validation", () => {
    const mockFile = (name: string, sizeMB: number) => ({
      name,
      size: sizeMB * 1024 * 1024,
    });

    const field = createField({
      type: "file",
      fileConfig: {
        allowedTypes: ["pdf", "jpg"],
        maxSizeMB: 5,
        maxFiles: 2,
      },
    });

    it("fails when maxFiles limit is exceeded", () => {
      const files = [
        mockFile("a.pdf", 1),
        mockFile("b.pdf", 1),
        mockFile("c.pdf", 1),
      ];

      expect(validateField(field, files)).toBe("validation.maxFilesExceeded|2");
    });

    it("fails when file type is not allowed", () => {
      const file = mockFile("test.exe", 1);

      expect(validateField(field, file)).toBe(
        "validation.fileTypeNotAllowed|PDF,JPG"
      );
    });

    it("fails when file size exceeds max size", () => {
      const file = mockFile("test.pdf", 10);

      expect(validateField(field, file)).toBe(
        "validation.fileSizeExceeded|5"
      );
    });

    it("passes when file is valid", () => {
      const file = mockFile("test.pdf", 2);

      expect(validateField(field, file)).toBe("");
    });
  });
});

it("skips invalid file objects gracefully", () => {
  const field = createField({
    type: "file",
    fileConfig: {
      allowedTypes: ["pdf"],
      maxSizeMB: 5,
    },
  });

  const files = [null, undefined, "invalid"];

  expect(validateField(field, files)).toBe("");
});

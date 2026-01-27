import { render, screen, fireEvent } from "@testing-library/react";
import TextField from "../Form/fields/TextField";
import type { Field } from "../../types/formTypes";

/* -------------------- mocks -------------------- */

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, options?: any) => options?.defaultValue || _key,
  }),
}));

/* -------------------- helpers -------------------- */

const renderComponent = (
  field: Field,
  value: any = "",
  props?: Partial<React.ComponentProps<typeof TextField>>
) => {
  const onChange = jest.fn();
  render(
    <TextField
      field={field}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
  return { onChange };
};

/* -------------------- test data -------------------- */

const baseField: Field = {
  id: "name",
  type: "text", // must match your FieldType
  label: "Name",
};

describe("TextField", () => {
  it("renders text field with label", () => {
    renderComponent(baseField);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("calls onChange with raw value for normal text field", () => {
    const { onChange } = renderComponent(baseField);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "John" },
    });

    expect(onChange).toHaveBeenCalledWith("name", "John");
  });

  it("sanitizes fullName to allow only letters and spaces", () => {
    const field: Field = {
      ...baseField,
      id: "fullName",
      label: "Full Name",
    };

    const { onChange } = renderComponent(field);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "John123@ Doe!" },
    });

    expect(onChange).toHaveBeenCalledWith("fullName", "John Doe");
  });

  it("sanitizes phone number to digits only and max 10 chars", () => {
    const field: Field = {
      ...baseField,
      id: "phone",
      label: "Phone",
    };

    const { onChange } = renderComponent(field);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "12345abc67890" },
    });

    expect(onChange).toHaveBeenCalledWith("phone", "1234567890");
  });

  it("limits date year to 4 digits", () => {
    const field: Field = {
      ...baseField,
      id: "dob",
      type: "date",
      label: "Date of Birth",
    };

    const { onChange } = renderComponent(field, "", { type: "date" });

    fireEvent.change(screen.getByLabelText("Date of Birth"), {
      target: { value: "12345-06-20" },
    });

    expect(onChange).toHaveBeenCalledWith("dob", "1234-06-20");
  });

  it("renders textarea when type is textarea", () => {
    renderComponent(baseField, "", { type: "textarea" });

    const textbox = screen.getByRole("textbox");
    expect(textbox).toHaveAttribute("rows", "4");
  });

  it("sets input to readOnly for calculatedTime field", () => {
    const field: Field = {
      ...baseField,
      id: "calculatedTime",
      label: "Calculated Time",
    };

    renderComponent(field);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
  });

  it("shows translated error message when error prop is provided", () => {
    renderComponent(baseField, "", {
      error: "Required field",
    });

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("uses translateError function when provided", () => {
    const translateError = jest.fn((e) => `Translated: ${e}`);

    renderComponent(baseField, "", {
      error: "INVALID",
      translateError,
    });

    expect(translateError).toHaveBeenCalledWith("INVALID");
    expect(screen.getByText("Translated: INVALID")).toBeInTheDocument();
  });

  it("marks field as required when mandatory is true", () => {
    const field: Field = {
      ...baseField,
      mandatory: true,
    };

    renderComponent(field);

    expect(screen.getByRole("textbox")).toBeRequired();
  });
});


import { render, screen, fireEvent } from "@testing-library/react";
import RadioField from "../Form/fields/RadioField";
import type { Field } from "../../types/formTypes";

/* -------------------- mocks -------------------- */

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, options?: any) => options?.defaultValue || _key,
  }),
}));

/* -------------------- test data -------------------- */


const mockField: Field = {
  id: "gender",
  type: "radio", 
  label: "Gender",
  mandatory: true,
  options: [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ],
};

/* -------------------- tests -------------------- */

describe("RadioField", () => {
  it("renders radio group label", () => {
    render(
      <RadioField
        field={mockField}
        value=""
        onChange={jest.fn()}
      />
    );

    expect(
      screen.getByText("Gender")
    ).toBeInTheDocument();
  });

  it("renders all radio options", () => {
    render(
      <RadioField
        field={mockField}
        value=""
        onChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText("Male")).toBeInTheDocument();
    expect(screen.getByLabelText("Female")).toBeInTheDocument();
  });

  it("selects the correct radio based on value prop", () => {
    render(
      <RadioField
        field={mockField}
        value="M"
        onChange={jest.fn()}
      />
    );

    const maleRadio = screen.getByLabelText("Male") as HTMLInputElement;
    const femaleRadio = screen.getByLabelText("Female") as HTMLInputElement;

    expect(maleRadio.checked).toBe(true);
    expect(femaleRadio.checked).toBe(false);
  });

  it("calls onChange with field id and selected value", () => {
    const onChangeMock = jest.fn();

    render(
      <RadioField
        field={mockField}
        value=""
        onChange={onChangeMock}
      />
    );

    fireEvent.click(screen.getByLabelText("Female"));

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith("gender", "F");
  });

  it("shows error message when error prop is provided", () => {
    render(
      <RadioField
        field={mockField}
        value=""
        error="Gender is required"
        onChange={jest.fn()}
      />
    );

    expect(
      screen.getByText("Gender is required")
    ).toBeInTheDocument();
  });

  it("does not show error message when error prop is not provided", () => {
    render(
      <RadioField
        field={mockField}
        value=""
        onChange={jest.fn()}
      />
    );

    expect(
      screen.queryByText("Gender is required")
    ).not.toBeInTheDocument();
  });
});

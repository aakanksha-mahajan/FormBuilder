import { render, screen, fireEvent } from "@testing-library/react";
import CheckboxField from "../Form/fields/CheckboxField";


jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) =>
      options?.defaultValue || key,
  }),
}));

const mockField = {
  id: "acceptTerms",
  label: "Accept Terms",
};

describe("CheckboxField", () => {
  it("renders checkbox field", () => {
    render(
      <CheckboxField
        field={mockField as any}
        value={false}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Accept Terms")).toBeInTheDocument();
  });

  it("checkbox reflects checked value", () => {
    render(
      <CheckboxField
        field={mockField as any}
        value={true}
        onChange={jest.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("calls onChange with correct value when clicked", () => {
    const onChange = jest.fn();

    render(
      <CheckboxField
        field={mockField as any}
        value={false}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith("acceptTerms", true);
  });

  it("renders error message when error is present", () => {
    render(
      <CheckboxField
        field={mockField as any}
        value={false}
        error="Required field"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("does not render error when error is undefined", () => {
    render(
      <CheckboxField
        field={mockField as any}
        value={false}
        onChange={jest.fn()}
      />
    );

    expect(
      screen.queryByText("Required field")
    ).not.toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import DropdownField from "../Form/fields/DropdownField";


jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) =>
      options?.defaultValue || key,
  }),
}));

const mockField = {
  id: "country",
  label: "Country",
  mandatory: true,
  options: [
    { label: "India", value: "IN" },
    { label: "United States", value: "US" },
  ],
};

describe("DropdownField", () => {
  it("renders dropdown with label", () => {
    render(
      <DropdownField
        field={mockField as any}
        value=""
        onChange={jest.fn()}
      />
    );


    expect(
      screen.getByRole("combobox", { name: /country/i })
    ).toBeInTheDocument();
  });

  it("renders all dropdown options", () => {
    render(
      <DropdownField
        field={mockField as any}
        value=""
        onChange={jest.fn()}
      />
    );

  
    const select = screen.getByRole("combobox", { name: /country/i });
    fireEvent.mouseDown(select);

    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
  });

  it("calls onChange with correct value when option is selected", () => {
    const onChange = jest.fn();

    render(
      <DropdownField
        field={mockField as any}
        value=""
        onChange={onChange}
      />
    );

    const select = screen.getByRole("combobox", { name: /country/i });
    fireEvent.mouseDown(select);

    fireEvent.click(screen.getByText("India"));

    expect(onChange).toHaveBeenCalledWith("country", "IN");
  });

  it("shows error message when error is provided", () => {
    render(
      <DropdownField
        field={mockField as any}
        value=""
        error="Country is required"
        onChange={jest.fn()}
      />
    );

    expect(
      screen.getByText("Country is required")
    ).toBeInTheDocument();
  });

  it("does not render error text when error is undefined", () => {
    render(
      <DropdownField
        field={mockField as any}
        value=""
        onChange={jest.fn()}
      />
    );

    expect(
      screen.queryByText("Country is required")
    ).not.toBeInTheDocument();
  });
});

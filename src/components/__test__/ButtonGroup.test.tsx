import { render, screen, fireEvent } from "@testing-library/react";
import ButtonGroup from "../Form/fields/ButtonGroup";
import type { Field } from "../../types/formTypes"

/* -------------------- mocks -------------------- */

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, options?: any) => options?.defaultValue || _key,
  }),
}));

/* -------------------- test data -------------------- */

const mockField: Field = {
  id: "actions",
  type: "buttonGroup", 
  buttons: [
    {
      label: "Next",
      action: "NEXT",
      primary: true,
    },
    {
      label: "Cancel",
      action: "CANCEL",
      primary: false,
    },
  ],
};


/* -------------------- tests -------------------- */

describe("ButtonGroup", () => {
  it("renders button group container", () => {
    render(<ButtonGroup field={mockField} onAction={jest.fn()} />);

    expect(
      screen.getByTestId("button-group-container")
    ).toBeInTheDocument();
  });

  it("renders all buttons", () => {
    render(<ButtonGroup field={mockField} onAction={jest.fn()} />);

    expect(screen.getByTestId("action-btn-0")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-1")).toBeInTheDocument();
  });

  it("calls onAction with correct action when button is clicked", () => {
    const onActionMock = jest.fn();

    render(<ButtonGroup field={mockField} onAction={onActionMock} />);

    fireEvent.click(screen.getByTestId("action-btn-0"));
    fireEvent.click(screen.getByTestId("action-btn-1"));

    expect(onActionMock).toHaveBeenCalledTimes(2);
    expect(onActionMock).toHaveBeenCalledWith("NEXT");
    expect(onActionMock).toHaveBeenCalledWith("CANCEL");
  });

  it("renders no buttons when buttons array is empty", () => {
    const emptyField: Field = {
      ...mockField,
      buttons: [],
    };

    render(<ButtonGroup field={emptyField} onAction={jest.fn()} />);

    expect(
      screen.queryByTestId("action-btn-0")
    ).not.toBeInTheDocument();
  });
});

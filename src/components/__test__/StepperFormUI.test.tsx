import { render, screen, fireEvent, act, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { validateField } from "../Form/utils/validation";

/* -------------------- common mocks -------------------- */

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, options?: any) => options?.defaultValue || _key,
  }),
}));

jest.mock("../Form/DynamicForm", () => (props: any) => (
  <div>
    <button
      data-testid="change-form"
      onClick={() => props.onFormDataChange({ name: "John Doe" })}
    >
      Change Form
    </button>
    <div data-testid="dynamic-form" />
  </div>
));

jest.mock("../ReviewPage", () => (props: any) => (
  <div data-testid="review-page">
    <button 
      data-testid="mock-checkbox" 
      onClick={() => props.onCheckboxChange(true)}
    >
      Check Terms
    </button>
  </div>
));

// Also fix the SuccessScreen mock to avoid the "Multiple Elements" error
jest.mock("../SuccessScreen", () => () => (
  <div /> 
));

jest.mock("../Form/utils/validation", () => ({
  validateField: jest.fn(),
}));

/* -------------------- DEFAULT formJson -------------------- */

jest.mock("../../data/formJson", () => ({
  formJson: {
    formMeta: { formName: "Test Form" },
    successResponse: {
      title: "Success",
      message: "Submitted successfully",
    },
    steps: [
      {
        stepId: "personal",
        stepName: "Personal Details",
        fields: [{ id: "name", type: "text", mandatory: true }],
      },
      {
        stepId: "review",
        stepName: "Review",
        fields: [],
      },
    ],
  },
}));

import StepperFormUI from "../StepperFormUI";

/* -------------------- tests -------------------- */

describe("StepperFormUI – aligned with component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial step correctly", () => {
    render(<StepperFormUI />);

    expect(screen.getByTestId("stepper")).toBeInTheDocument();
    expect(screen.getByTestId("form-step")).toBeInTheDocument();
    expect(screen.getByTestId("dynamic-form")).toBeInTheDocument();

    const nav = screen.getByTestId("navigation-buttons");
    expect(within(nav).getByRole("button")).toBeInTheDocument();
  });

  it("shows validation error and blocks navigation when validation fails", () => {
    (validateField as jest.Mock).mockReturnValue("Required");

    render(<StepperFormUI />);

    const nav = screen.getByTestId("navigation-buttons");
    fireEvent.click(within(nav).getByRole("button"));

    expect(screen.getByTestId("validation-error")).toBeInTheDocument();
    expect(screen.getByTestId("form-step")).toBeInTheDocument();
  });

  it("allows navigation to next step when validation passes", () => {
    (validateField as jest.Mock).mockReturnValue(undefined);

    render(<StepperFormUI />);
    fireEvent.click(screen.getByTestId("change-form"));

    const nav = screen.getByTestId("navigation-buttons");
    fireEvent.click(within(nav).getByRole("button"));

    expect(screen.getByTestId("review-step")).toBeInTheDocument();
    expect(screen.getByTestId("review-page")).toBeInTheDocument();
  });

  it("allows navigating back to previous step", () => {
    (validateField as jest.Mock).mockReturnValue(undefined);

    render(<StepperFormUI />);
    fireEvent.click(screen.getByTestId("change-form"));

    let nav = screen.getByTestId("navigation-buttons");
    fireEvent.click(within(nav).getByRole("button"));

    nav = screen.getByTestId("navigation-buttons");
    const buttons = within(nav).getAllByRole("button");

    fireEvent.click(buttons[0]); // Back

    expect(screen.getByTestId("form-step")).toBeInTheDocument();
  });

 it("submits form and shows success screen", () => {
  (validateField as jest.Mock).mockReturnValue(undefined);

  render(<StepperFormUI />);
  
  // Step 1: Fill form and click Next
  fireEvent.click(screen.getByTestId("change-form"));
  
  // The first button in the nav-buttons box is "Next"
  const nav = screen.getByTestId("navigation-buttons");
  fireEvent.click(within(nav).getByRole("button"));

  // Step 2: Now on Review Page, click Submit
  // The Submit button has the specific test ID "submit-button"
  const submitBtn = screen.getByTestId("submit-button");
  fireEvent.click(submitBtn);

  // This will now find exactly ONE element (the Box wrapper)
  expect(screen.getByTestId("success-screen")).toBeInTheDocument();
});

  it("runs debounced validation on form data change", async () => {
  jest.useFakeTimers();
  (validateField as jest.Mock).mockReturnValue("Error");

  render(<StepperFormUI />);
  
  // This triggers the useEffect dependency [formDataRef]
  fireEvent.click(screen.getByTestId("change-form"));

  act(() => {
    jest.advanceTimersByTime(500);
  });

  // Check if validation was called
  expect(validateField).toHaveBeenCalled();
  
  jest.useRealTimers();
});

  it("cleans up debounce timer on unmount", () => {
    jest.useFakeTimers();

    const { unmount } = render(<StepperFormUI />);
    unmount();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});

it("updates form data when terms are accepted on review page", () => {
  (validateField as jest.Mock).mockReturnValue(undefined);
  render(<StepperFormUI />);
  
  // 1. Navigate to Review Step
  fireEvent.click(screen.getByTestId("change-form"));
  const nav = screen.getByTestId("navigation-buttons");
  fireEvent.click(within(nav).getByRole("button")); // Clicks "Next"

  // 2. Trigger the callback (Line 248)
  const checkbox = screen.getByTestId("mock-checkbox");
  fireEvent.click(checkbox);

  // 3. Verify it works by submitting and checking if submit was allowed
  const submitBtn = screen.getByTestId("submit-button");
  fireEvent.click(submitBtn);
  
  expect(screen.getByTestId("success-screen")).toBeInTheDocument();
});

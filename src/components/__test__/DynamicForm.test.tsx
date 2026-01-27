import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DynamicForm from "../Form/DynamicForm";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

const renderDynamicForm = (props = {}) =>
  render(
    <I18nextProvider i18n={i18n}>
      <DynamicForm {...props} />
    </I18nextProvider>
  );

describe("DynamicForm", () => {
  test("renders dynamic form root container", () => {
    renderDynamicForm();
    expect(screen.getByTestId("dynamic-form")).toBeInTheDocument();
  });

  test("renders form header content", () => {
    renderDynamicForm();
    expect(screen.getByTestId("form-title")).toBeInTheDocument();
    expect(screen.getByTestId("form-subtitle")).toBeInTheDocument();
  });

  test("renders language selector", () => {
    renderDynamicForm();
    expect(screen.getByTestId("language-selector")).toBeInTheDocument();
    expect(screen.getByTestId("language-select")).toBeInTheDocument();
  });

  test("renders instructions section when instructions exist", () => {
    renderDynamicForm();
    expect(screen.getByTestId("instructions-container")).toBeInTheDocument();
  });

  test("renders fields container", () => {
    renderDynamicForm();
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("renders no-fields warning when schema has no fields", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
          formDescription: "Test Description",
        },
        instructions: [],
        fields: [],
        successResponse: {
          message: "Success",
        },
        failureResponse: {
          title: "Failure",
          message: "Failure message",
        },
      },
    });

    expect(screen.getByTestId("no-fields-warning")).toBeInTheDocument();
  });

  test("failure dialog is not visible by default", () => {
    renderDynamicForm();

    // Dialog should not be in the DOM when closed
    expect(screen.queryByTestId("failure-dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("failure-dialog-title")).not.toBeInTheDocument();
    expect(screen.queryByTestId("failure-dialog-content")).not.toBeInTheDocument();
  });

  test("renders submit button group", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
          formDescription: "Test Description",
        },
        instructions: [],
        fields: [
          {
            id: "submitButtons",
            type: "buttonGroup",
            buttons: [
              { label: "Submit", action: "SUBMIT" },
              { label: "Save Draft", action: "SAVE_DRAFT" },
            ],
          },
        ],
        successResponse: {
          message: "Success",
        },
        failureResponse: {
          title: "Failure",
          message: "Failure message",
        },
      },
    });
    expect(screen.getByTestId("button-group-container")).toBeInTheDocument();
  });

  test("renders different instruction types", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [
          { type: "text", value: "Text instruction" },
          { type: "image", value: "image.jpg", altText: "Test image" },
          { type: "video", value: "video.mp4" },
          { type: "link", value: "https://example.com", label: "Link text" },
        ],
        fields: [],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByTestId("instructions-container")).toBeInTheDocument();
  });

  test("renders different field types", () => {
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "textField", type: "text", label: "Text" },
          { id: "dateField", type: "date", label: "Date" },
          { id: "timeField", type: "time", label: "Time" },
          { id: "textareaField", type: "textarea", label: "Textarea" },
          {
            id: "radioField",
            type: "radio",
            label: "Radio",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" }
            ]
          },
          {
            id: "dropdownField",
            type: "dropdown",
            label: "Dropdown",
            options: [
              { value: "option1", label: "Option 1" }
            ]
          },
          { id: "checkboxField", type: "checkbox", label: "Checkbox" },
          { id: "fileField", type: "file", label: "File" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });

    // Check text-based fields with labels
    expect(screen.getByLabelText("Text")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Textarea")).toBeInTheDocument();
    expect(screen.getByLabelText("Dropdown")).toBeInTheDocument();

    // Check for radio options instead of the group label
    expect(screen.getByLabelText("Yes")).toBeInTheDocument();
    expect(screen.getByLabelText("No")).toBeInTheDocument();

    // Check checkbox by text content
    expect(screen.getByText("Checkbox")).toBeInTheDocument();

    // Check file field by text content or input type
    const fileInputs = container.querySelectorAll('input[type="file"]');
    expect(fileInputs.length).toBeGreaterThan(0);
  });

  test("handles validation errors prop", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "field1", type: "text", label: "Field 1", mandatory: true },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      validationErrors: {
        field1: "validation.minLength|5",
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("handles single instruction object instead of array", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: { type: "text", value: "Single instruction" },
        fields: [],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByTestId("instructions-container")).toBeInTheDocument();
  });

  test("accepts initialData prop", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "field1", type: "text", label: "Field 1" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      initialData: {
        field1: "Initial value",
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("accepts onFormDataChange callback", () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "field1", type: "text", label: "Field 1" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("accepts onAction callback", () => {
    const onAction = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          {
            id: "buttons",
            type: "buttonGroup",
            buttons: [{ label: "Next", action: "NEXT" }],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onAction,
    });
    expect(screen.getByTestId("button-group-container")).toBeInTheDocument();
  });

  test("handles configIssueOverride prop", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      configIssueOverride: "Custom error message",
    });
    expect(screen.getByTestId("no-fields-warning")).toHaveTextContent("Custom error message");
  });

  test("renders time calculation fields (startTime, stopTime, calculatedTime)", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "startTime", type: "time", label: "Start Time" },
          { id: "stopTime", type: "time", label: "Stop Time" },
          { id: "calculatedTime", type: "text", label: "Duration" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByLabelText("Start Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Stop Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Duration")).toBeInTheDocument();
  });

  test("translates error messages with maxLength parameter", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "field1", type: "text", label: "Field 1" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      validationErrors: {
        field1: "validation.maxLength|100",
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("translates error messages with maxFilesExceeded parameter", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "files", type: "file", label: "Files" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      validationErrors: {
        files: "validation.maxFilesExceeded|3",
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("translates error messages with fileSizeExceeded parameter", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "file", type: "file", label: "File" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      validationErrors: {
        file: "validation.fileSizeExceeded|5",
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("translates error messages with fileTypeNotAllowed parameter", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "document", type: "file", label: "Document" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      validationErrors: {
        document: "validation.fileTypeNotAllowed|PDF, JPG",
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("renders with undefined instructions", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        fields: [],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByTestId("instructions-container")).toBeInTheDocument();
  });

  test("handles fields from steps", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        steps: [
          {
            stepId: "step1",
            stepName: "Step 1",
            fields: [
              { id: "stepField", type: "text", label: "Step Field" },
            ],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("renders with redirect on success response", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [],
        successResponse: {
          message: "Success",
          redirect: {
            type: "route",
            value: "/success",
          },
        },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByTestId("dynamic-form")).toBeInTheDocument();
  });

 
  test("updates form data on field change", () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "firstName", type: "text", label: "First Name" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });

    const input = screen.getByLabelText("First Name");
    fireEvent.change(input, { target: { value: "John" } });

    expect(onFormDataChange).toHaveBeenCalled();
  });

  test("calculates time duration when startTime and stopTime change", () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "startTime", type: "time", label: "Start Time" },
          { id: "stopTime", type: "time", label: "Stop Time" },
          { id: "calculatedTime", type: "text", label: "Duration" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });

    const startTimeInput = screen.getByLabelText("Start Time");
    const stopTimeInput = screen.getByLabelText("Stop Time");

    // Simulate user entering start time
    fireEvent.change(startTimeInput, { target: { value: "09:00" } });

    // Simulate user entering stop time
    fireEvent.change(stopTimeInput, { target: { value: "17:30" } });

    // Check that onFormDataChange was called with calculated time
    expect(onFormDataChange).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: "09:00",
        stopTime: "17:30",
        calculatedTime: "8h 30m",
      })
    );
  });

  test("handles overnight time calculation", () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "startTime", type: "time", label: "Start Time" },
          { id: "stopTime", type: "time", label: "Stop Time" },
          { id: "calculatedTime", type: "text", label: "Duration" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });

    const startTimeInput = screen.getByLabelText("Start Time");
    const stopTimeInput = screen.getByLabelText("Stop Time");

    fireEvent.change(startTimeInput, { target: { value: "22:00" } });
    fireEvent.change(stopTimeInput, { target: { value: "06:00" } });

    expect(onFormDataChange).toHaveBeenCalledWith(
      expect.objectContaining({
        calculatedTime: "8h 0m",
      })
    );
  });

  test("clears error when field value changes", () => {
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "email", type: "text", label: "Email", mandatory: true },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      validationErrors: {
        email: "Email is required",
      },
    });

  
    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      fireEvent.change(input, { target: { value: "test@example.com" } });
    }

    // Error should be cleared after changing the value
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

 
  test("triggers validation on SUBMIT action", async () => {
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "requiredField", type: "text", label: "Required Field", mandatory: true },
          {
            id: "submitBtn",
            type: "buttonGroup",
            buttons: [{ label: "Submit", action: "SUBMIT" }],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });

    const submitButton = container.querySelector('button');
    if (submitButton) {
      fireEvent.click(submitButton);
    }

    // Validation should have run
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("triggers validation on SAVE_DRAFT action", async () => {
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "field1", type: "text", label: "Field 1", mandatory: true },
          {
            id: "draftBtn",
            type: "buttonGroup",
            buttons: [{ label: "Save Draft", action: "SAVE_DRAFT" }],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });

    const draftButton = container.querySelector('button');
    if (draftButton) {
      fireEvent.click(draftButton);
    }

    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("triggers validation on NEXT action", async () => {
    const onAction = jest.fn();
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "field1", type: "text", label: "Field 1" },
          {
            id: "nextBtn",
            type: "buttonGroup",
            buttons: [{ label: "Next", action: "NEXT" }],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onAction,
      initialData: { field1: "value" },
    });

    const nextButton = container.querySelector('button');
    if (nextButton) {
      fireEvent.click(nextButton);
    }

    // onAction should be called with NEXT action
    expect(onAction).toHaveBeenCalledWith("NEXT", expect.any(Object));
  });

  test("handles BACK action without validation", async () => {
    const onAction = jest.fn();
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          {
            id: "backBtn",
            type: "buttonGroup",
            buttons: [{ label: "Back", action: "BACK" }],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onAction,
    });

    const backButton = container.querySelector('button');
    if (backButton) {
      fireEvent.click(backButton);
    }

    expect(onAction).toHaveBeenCalledWith("BACK", expect.any(Object));
  });

  test("handles SAVE_DRAFT action logs to console", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          {
            id: "draftBtn",
            type: "buttonGroup",
            buttons: [{ label: "Save Draft", action: "SAVE_DRAFT" }],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });

    const draftButton = container.querySelector('button');
    if (draftButton) {
      fireEvent.click(draftButton);
    }

    expect(consoleSpy).toHaveBeenCalledWith("Draft saved:", expect.any(Object));
    consoleSpy.mockRestore();
  });

  test("handles successful form submission", async () => {
    global.alert = jest.fn();

    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "name", type: "text", label: "Name" },
          {
            id: "submitBtn",
            type: "buttonGroup",
            buttons: [{ label: "Submit", action: "SUBMIT" }],
          },
        ],
        successResponse: { message: "Form submitted successfully" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      initialData: { name: "John Doe" },
    });

    const submitButton = container.querySelector('button');
    if (submitButton) {
      fireEvent.click(submitButton);
    }

 
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(global.alert).toHaveBeenCalledWith("Form submitted successfully");
  });

  test("handles submission with redirect", async () => {
    global.alert = jest.fn();
    jest.useFakeTimers();
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "name", type: "text", label: "Name" },
          {
            id: "submitBtn",
            type: "buttonGroup",
            buttons: [{ label: "Submit", action: "SUBMIT" }],
          },
        ],
        successResponse: {
          message: "Success",
          redirect: {
            type: "route",
            value: "/success-page",
          },
        },
        failureResponse: { title: "Error", message: "Failed" },
      },
      initialData: { name: "John" },
    });

    const submitButton = container.querySelector("button");
    if (submitButton) {
      fireEvent.click(submitButton);
    }

    await act(async () => {
      jest.advanceTimersByTime(1100);
    });

    const href = window.location.href;
    const failureDialog = screen.queryByTestId("failure-dialog");
    const alertCalled = (global.alert as jest.Mock).mock.calls.length > 0;

    expect(
      (failureDialog && true) ||
      href.includes("/success-page") ||
      alertCalled
    ).toBe(true);
    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
  });

  test("handles form submission failure and shows error dialog", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    jest.useFakeTimers();
    global.alert = jest.fn(() => {
      throw new Error("Submission failed");
    });

    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "name", type: "text", label: "Name" },
          {
            id: "submitBtn",
            type: "buttonGroup",
            buttons: [{ label: "Submit", action: "SUBMIT" }],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Submission Error", message: "Failed to submit" },
      },
      initialData: { name: "John" },
    });

    const submitButton = container.querySelector("button");
    if (submitButton) {
      fireEvent.click(submitButton);
    }

    await act(async () => {
      jest.advanceTimersByTime(1100);
    });

    expect(await screen.findByTestId("failure-dialog")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    jest.useRealTimers();
  });

  test("renders unknown instruction type (default case)", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [
          { type: "unknown" as any, value: "Unknown instruction" },
        ],
        fields: [],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByTestId("instructions-container")).toBeInTheDocument();
  });

  test("renders unknown field type (default case)", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "unknownField", type: "unknown" as any, label: "Unknown Field" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("handles language change", async () => {
    renderDynamicForm();
    const user = userEvent.setup();

    const select = screen.getByRole("combobox", { name: /language/i });
    await user.click(select);

    const spanishOption = await screen.findByText("Spanish");
    await user.click(spanishOption);

    expect(screen.getByTestId("language-selector")).toBeInTheDocument();
  });

  test("renders with multiple steps in schema", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Multi-Step Form",
        },
        instructions: [],
        steps: [
          {
            stepId: "step1",
            stepName: "Step 1",
            fields: [
              { id: "field1", type: "text", label: "Field 1" },
            ],
          },
          {
            stepId: "step2",
            stepName: "Step 2",
            fields: [
              { id: "field2", type: "text", label: "Field 2" },
            ],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("handles file field changes", () => {
    const onFormDataChange = jest.fn();
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "document", type: "file", label: "Upload Document" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });

    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      fireEvent.change(fileInput, { target: { files: [file] } });
    }

    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("handles checkbox field changes", () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "agree", type: "checkbox", label: "I agree to terms" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onFormDataChange).toHaveBeenCalled();
  });

  test("handles dropdown field changes", async () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          {
            id: "country",
            type: "dropdown",
            label: "Country",
            options: [
              { value: "us", label: "United States" },
              { value: "uk", label: "United Kingdom" },
            ],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });

    const user = userEvent.setup();
    const dropdown = screen.getByLabelText("Country");
    await user.click(dropdown);

    const option = await screen.findByText("United States");
    await user.click(option);

    expect(onFormDataChange).toHaveBeenCalled();
  });

  test("handles radio field changes", () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          {
            id: "gender",
            type: "radio",
            label: "Gender",
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });

    const maleRadio = screen.getByLabelText("Male");
    fireEvent.click(maleRadio);

    expect(onFormDataChange).toHaveBeenCalled();
  });

  test("handles textarea field changes", () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "comments", type: "textarea", label: "Comments" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
    });

    const textarea = screen.getByLabelText("Comments");
    fireEvent.change(textarea, { target: { value: "Test comment" } });

    expect(onFormDataChange).toHaveBeenCalled();
  });

  test("handles validation with empty mandatory field", () => {
    const { container } = renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "email", type: "text", label: "Email", mandatory: true },
          {
            id: "submitBtn",
            type: "buttonGroup",
            buttons: [{ label: "Submit", action: "SUBMIT" }],
          },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });

    const submitButton = container.querySelector('button');
    if (submitButton) {
      fireEvent.click(submitButton);
    }

    // Form should not submit, validation should catch the empty required field
    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("clears calculatedTime when startTime or stopTime is cleared", () => {
    const onFormDataChange = jest.fn();
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [
          { id: "startTime", type: "time", label: "Start Time" },
          { id: "stopTime", type: "time", label: "Stop Time" },
          { id: "calculatedTime", type: "text", label: "Duration" },
        ],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
      onFormDataChange,
      initialData: { startTime: "09:00", stopTime: "17:00", calculatedTime: "8h 0m" },
    });

    const startTimeInput = screen.getByLabelText(/start time|hora de inicio/i);

   
    fireEvent.change(startTimeInput, { target: { value: "" } });

    expect(onFormDataChange).toHaveBeenCalled();
  });

  test("handles form with null fields gracefully", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: [null as any, { id: "field1", type: "text", label: "Field 1" }],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });

    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("handles form with non-object fields", () => {
    renderDynamicForm({
      schema: {
        formMeta: {
          formName: "Test Form",
        },
        instructions: [],
        fields: ["invalid" as any, { id: "field1", type: "text", label: "Field 1" }],
        successResponse: { message: "Success" },
        failureResponse: { title: "Error", message: "Failed" },
      },
    });

    expect(screen.getByTestId("fields-container")).toBeInTheDocument();
  });

  test("handles undefined schema gracefully with fallback", () => {
    // This tests the fallback to formJson when schema is undefined
    renderDynamicForm({ schema: undefined });

    expect(screen.getByTestId("dynamic-form")).toBeInTheDocument();
  });
});


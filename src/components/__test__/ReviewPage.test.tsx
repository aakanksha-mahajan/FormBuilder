import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewPage from "../ReviewPage";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
  }),
}));


jest.mock("../../data/formJson", () => ({
  formJson: {
    steps: [
      {
        stepId: "personal",
        stepName: "Personal Info",
        fields: [
          { id: "username", label: "Username", type: "text" },
          { id: "gender", label: "Gender", type: "radio", options: [{ value: "m", label: "Male" }] },
     { id: "hobbies", label: "Hobbies", type: "checkbox-group" },
          { id: "files", label: "Documents", type: "file" },
          { id: "resume", label: "Resume", type: "file" }
        ],
      }
    ],
  },
}));

describe("ReviewPage Component", () => {
  const mockOnCheckboxChange = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders 'No data' message when allFormData is empty", () => {
    render(<ReviewPage allFormData={{}} validationErrors={{}} />);
    expect(screen.getByTestId("no-data-message")).toBeInTheDocument();
  });

  it("renders sections and formats different field types correctly", () => {
    const formData = {
      username: 'john_doe',
      gender: 'm',
      hobbies: true,
      files: [{ name: 'resume.pdf' }, 'old_file.txt'],
    };

    render(<ReviewPage allFormData={formData} validationErrors={{}} />);

    expect(screen.getByTestId("review-value-username")).toHaveTextContent("john_doe");
    // Match the actual received value "Male" from your test log
    expect(screen.getByTestId("review-value-gender")).toHaveTextContent("Male");
    expect(screen.getByTestId("review-value-hobbies")).toHaveTextContent("Yes");
    expect(screen.getByTestId("review-value-files")).toHaveTextContent("resume.pdf, old_file.txt");
  });

  it("calls onCheckboxChange when the checkbox is toggled", () => {
    render(<ReviewPage allFormData={{}} validationErrors={{}} onCheckboxChange={mockOnCheckboxChange} />);
    
    // MUI puts the data-testid on the span, so we find the input inside it
    const checkbox = screen.getByTestId("terms-checkbox-input");
    fireEvent.click(checkbox);
    
    expect(mockOnCheckboxChange).toHaveBeenCalledWith(true);
  });

  it("displays validation error for terms confirmation", () => {
    const errors = { termsAccepted: "You must confirm the details" };
    render(<ReviewPage allFormData={{}} validationErrors={errors} />);
    
    expect(screen.getByTestId("terms-error-message")).toHaveTextContent("You must confirm the details");
  });

  it("covers specific formatValue branches (single file and default string)", () => {
    const formData = {
      files: { name: "single.png" }, // Single file object
      username: 12345 // Hits the String(value) fallback
    };
    render(<ReviewPage allFormData={formData} validationErrors={{}} />);
    
    expect(screen.getByTestId("review-value-files")).toHaveTextContent("single.png");
    expect(screen.getByTestId("review-value-username")).toHaveTextContent("12345");
  });
});

it("covers specific file fallback branches (Line 76 and 88)", () => {
    const formData = {
      files: [{ name: "valid.pdf" }, { id: "no-name-property" }], 
      resume: "some-server-file-id-123"
    };

    render(<ReviewPage allFormData={formData} validationErrors={{}} />);

   
    expect(screen.getByTestId("review-value-files")).toHaveTextContent("valid.pdf, [object Object]");

    
    expect(screen.getByTestId("review-value-resume")).toHaveTextContent("File uploaded");
  });

  it("uncovers line 78 by formatting a non-file array", () => {
  const formData = {
    
    hobbies: ["Coding", "Reading", "Gaming"]
  };

  render(<ReviewPage allFormData={formData} validationErrors={{}} />);

  const displayValue = screen.getByTestId("review-value-hobbies");
  
  
  expect(displayValue).toHaveTextContent("Coding, Reading, Gaming");
});

it("uncovers line 94 by formatting a boolean checkbox value", () => {
  const formData = {
    hobbies: true 
  };

  render(<ReviewPage allFormData={formData} validationErrors={{}} />);

  const displayValue = screen.getByTestId("review-value-hobbies");
  
  
  expect(displayValue).toHaveTextContent("Yes");
});
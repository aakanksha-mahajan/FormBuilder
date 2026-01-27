import { render, screen, fireEvent } from "@testing-library/react";
import FileField from "../Form/fields/FileField";


jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) =>
      options?.defaultValue || key,
  }),
}));

const mockField = {
  id: "resume",
  label: "Upload Resume",
  mandatory: true,
  fileConfig: {
    allowedTypes: ["pdf"],
    multiple: false,
  },
};

describe("FileField", () => {
  it("renders label and upload button", () => {
    render(
      <FileField
        field={mockField as any}
        value={null}
        onChange={jest.fn()}
      />
    );

    expect(
      screen.getByTestId("filefield-label-resume")
    ).toHaveTextContent("Upload Resume");

    expect(
      screen.getByTestId("file-upload-btn-resume")
    ).toBeInTheDocument();
  });

  it("calls onChange with selected file", () => {
    const onChange = jest.fn();
    const file = new File(["dummy"], "resume.pdf", {
      type: "application/pdf",
    });

    render(
      <FileField
        field={mockField as any}
        value={null}
        onChange={onChange}
      />
    );

    const input = screen.getByTestId(
      "file-input-resume"
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(onChange).toHaveBeenCalledWith("resume", file);
  });

   it("calls onChange with selected files when multiple is true", () => {
    const onChange = jest.fn();
    const multipleField = {
      ...mockField,
      fileConfig: {
        ...mockField.fileConfig,
        multiple: true,
      },
    };
    const fileOne = new File(["dummy"], "resume-1.pdf", {
      type: "application/pdf",
    });
    const fileTwo = new File(["dummy"], "resume-2.pdf", {
      type: "application/pdf",
    });

    render(
      <FileField
        field={multipleField as any}
        value={null}
        onChange={onChange}
      />
    );

    const input = screen.getByTestId(
      "file-input-resume"
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [fileOne, fileTwo] },
    });

    expect(onChange).toHaveBeenCalledWith("resume", [fileOne, fileTwo]);
  });

  it("shows selected file name", () => {
    const file = new File(["dummy"], "resume.pdf", {
      type: "application/pdf",
    });

    render(
      <FileField
        field={mockField as any}
        value={file}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });

  it("renders error message when error exists", () => {
    render(
      <FileField
        field={mockField as any}
        value={null}
        error="File is required"
        onChange={jest.fn()}
      />
    );

    expect(
      screen.getByTestId("filefield-error-resume")
    ).toHaveTextContent("File is required");
  });

  it("does not render error when error is undefined", () => {
    render(
      <FileField
        field={mockField as any}
        value={null}
        onChange={jest.fn()}
      />
    );

    expect(
      screen.queryByTestId("filefield-error-resume")
    ).not.toBeInTheDocument();
  });
});

it("uses translateError when provided", () => {
  const translateError = jest.fn(() => "Translated error");

  render(
    <FileField
      field={mockField as any}
      value={null}
      error="some.error.key"
      translateError={translateError}
      onChange={jest.fn()}
    />
  );

  expect(translateError).toHaveBeenCalledWith("some.error.key");
  expect(screen.getByText("Translated error")).toBeInTheDocument();
});
it("renders file type not allowed error with params", () => {
  render(
    <FileField
      field={mockField as any}
      value={null}
      error="validation.fileTypeNotAllowed|pdf"
      onChange={jest.fn()}
    />
  );

  expect(
    screen.getByText("File type not allowed. Allowed types: pdf")
  ).toBeInTheDocument();
});
it("renders file size exceeded error", () => {
  render(
    <FileField
      field={mockField as any}
      value={null}
      error="validation.fileSizeExceeded|5"
      onChange={jest.fn()}
    />
  );

  expect(
    screen.getByText("File size exceeds 5MB limit")
  ).toBeInTheDocument();
});

it("renders max files exceeded error", () => {
  render(
    <FileField
      field={mockField as any}
      value={null}
      error="validation.maxFilesExceeded|3"
      onChange={jest.fn()}
    />
  );

  expect(
    screen.getByText("Maximum 3 files allowed")
  ).toBeInTheDocument();
});
it("renders file configuration info text", () => {
  const fieldWithConfig = {
    ...mockField,
    fileConfig: {
      allowedTypes: ["pdf"],
      maxSizeMB: 5,
      multiple: true,
      maxFiles: 3,
    },
  };

  render(
    <FileField
      field={fieldWithConfig as any}
      value={null}
      onChange={jest.fn()}
    />
  );

  expect(
    screen.getByText(/Allowed: PDF/i)
  ).toBeInTheDocument();

  expect(
    screen.getByText(/Max size: 5MB/i)
  ).toBeInTheDocument();

  expect(
    screen.getByText(/Max files: 3/i)
  ).toBeInTheDocument();
});

it("covers all fileConfig info branches (line 84)", () => {
  const fieldWithFullConfig = {
    id: "resume",
    label: "Upload Resume",
    fileConfig: {
      allowedTypes: ["pdf"],
      maxSizeMB: 5,
      multiple: true,
      maxFiles: 3,
    },
  };

  render(
    <FileField
      field={fieldWithFullConfig as any}
      value={null}
      onChange={jest.fn()}
    />
  );

  expect(screen.getByText(/Allowed:/i)).toBeInTheDocument();
  expect(screen.getByText(/PDF/i)).toBeInTheDocument();
  expect(screen.getByText(/Max size: 5MB/i)).toBeInTheDocument();
  expect(screen.getByText(/Max files: 3/i)).toBeInTheDocument();
});
it("covers branch when fileConfig exists but allowedTypes is missing (line 84)", () => {
  const fieldWithoutAllowedTypes = {
    id: "resume",
    label: "Upload Resume",
    fileConfig: {
      maxSizeMB: 5,
      multiple: false,
    },
  };

  render(
    <FileField
      field={fieldWithoutAllowedTypes as any}
      value={null}
      onChange={jest.fn()}
    />
  );

 
  expect(screen.queryByText(/Allowed:/i)).not.toBeInTheDocument();
});
it("covers allowedTypes without maxSizeMB and without maxFiles", () => {
  const fieldPartialConfig = {
    id: "resume",
    label: "Upload Resume",
    fileConfig: {
      allowedTypes: ["pdf"],
      multiple: true, 
     
    },
  };

  render(
    <FileField
      field={fieldPartialConfig as any}
      value={null}
      onChange={jest.fn()}
    />
  );

  expect(screen.getByText(/Allowed: PDF/i)).toBeInTheDocument();
  expect(screen.queryByText(/Max size/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Max files/i)).not.toBeInTheDocument();
});

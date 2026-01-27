import { render, screen } from "@testing-library/react";
import LinkInstruction from "../Form/instructions/LinkInstruction";

describe("LinkInstruction", () => {
  const linkValue = "https://example.com";

  it("renders link instruction container", () => {
    render(<LinkInstruction value={linkValue} />);

    expect(
      screen.getByTestId("link-instruction-container")
    ).toBeInTheDocument();
  });

  it("renders link with href value", () => {
    render(<LinkInstruction value={linkValue} />);

    const link = screen.getByTestId(
      "link-instruction-link"
    ) as HTMLAnchorElement;

    expect(link).toBeInTheDocument();
    expect(link.href).toContain(linkValue);
  });

  it("uses value as link text when label is not provided", () => {
    render(<LinkInstruction value={linkValue} />);

    const link = screen.getByTestId("link-instruction-link");
    expect(link).toHaveTextContent(linkValue);
  });

  it("uses label as link text when label is provided", () => {
    render(
      <LinkInstruction
        value={linkValue}
        label="Click here to learn more"
      />
    );

    const link = screen.getByTestId("link-instruction-link");
    expect(link).toHaveTextContent("Click here to learn more");
  });

  it("opens link in new tab with security attributes", () => {
    render(<LinkInstruction value={linkValue} />);

    const link = screen.getByTestId("link-instruction-link");

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });
});

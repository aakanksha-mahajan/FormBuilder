import { render, screen } from "@testing-library/react";
import ImageInstruction from "../Form/instructions/ImageInstruction";

describe("ImageInstruction", () => {
  const imageSrc = "https://example.com/test-image.png";

  it("renders image container", () => {
    render(<ImageInstruction value={imageSrc} />);

    expect(
      screen.getByTestId("image-instruction-container")
    ).toBeInTheDocument();
  });

  it("renders image with correct src", () => {
    render(<ImageInstruction value={imageSrc} />);

    const img = screen.getByTestId(
      "image-instruction-img"
    ) as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.src).toContain(imageSrc);
  });

  it("uses default alt text when altText is not provided", () => {
    render(<ImageInstruction value={imageSrc} />);

    const img = screen.getByTestId("image-instruction-img");
    expect(img).toHaveAttribute("alt", "instruction image");
  });

  it("uses provided alt text when altText is passed", () => {
    render(
      <ImageInstruction
        value={imageSrc}
        altText="How to upload document"
      />
    );

    const img = screen.getByTestId("image-instruction-img");
    expect(img).toHaveAttribute("alt", "How to upload document");
  });
});

import { render, screen } from "@testing-library/react";
import TextInstruction from "../Form/instructions/TextInstruction";

describe("TextInstruction", () => {
  const textValue = "Please read the instructions carefully";

  it("renders text instruction", () => {
    render(<TextInstruction value={textValue} />);

    expect(
      screen.getByTestId("text-instruction")
    ).toBeInTheDocument();
  });

  it("renders the correct text content", () => {
    render(<TextInstruction value={textValue} />);

    expect(
      screen.getByTestId("text-instruction")
    ).toHaveTextContent(textValue);
  });
});

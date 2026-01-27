import { render, screen } from "@testing-library/react";
import VideoInstruction from "../Form/instructions/VideoInstruction";

describe("VideoInstruction", () => {
  const videoSrc = "https://example.com/sample-video.mp4";

  it("renders video instruction container", () => {
    render(<VideoInstruction value={videoSrc} />);

    expect(
      screen.getByTestId("video-instruction-container")
    ).toBeInTheDocument();
  });

  it("renders video element", () => {
    render(<VideoInstruction value={videoSrc} />);

    expect(
      screen.getByTestId("video-instruction-video")
    ).toBeInTheDocument();
  });

  it("renders video source with correct src", () => {
    render(<VideoInstruction value={videoSrc} />);

    const source = screen
      .getByTestId("video-instruction-video")
      .querySelector("source") as HTMLSourceElement;

    expect(source).toBeInTheDocument();
    expect(source.src).toContain(videoSrc);
    expect(source.type).toBe("video/mp4");
  });

  it("renders controls on video", () => {
    render(<VideoInstruction value={videoSrc} />);

    const video = screen.getByTestId(
      "video-instruction-video"
    ) as HTMLVideoElement;

    expect(video).toHaveAttribute("controls");
  });
});

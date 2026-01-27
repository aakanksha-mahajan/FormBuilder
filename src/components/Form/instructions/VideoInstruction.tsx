import { Box } from "@mui/material";

interface Props {
  value: string;
}

const VideoInstruction: React.FC<Props> = ({ value }) => {
  return (
    <Box sx={{ mb: 2 }} data-testid="video-instruction-container">
      <video width="100%" controls data-testid="video-instruction-video">
        <source src={value} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default VideoInstruction;


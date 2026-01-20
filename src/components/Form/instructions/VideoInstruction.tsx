import { Box } from "@mui/material";

interface Props {
  value: string;
}

const VideoInstruction: React.FC<Props> = ({ value }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <video width="100%" controls>
        <source src={value} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default VideoInstruction;


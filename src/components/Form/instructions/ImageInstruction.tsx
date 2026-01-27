import { Box } from "@mui/material";

interface Props {
  value: string;
  altText?: string;
}

const ImageInstruction: React.FC<Props> = ({ value, altText }) => {
  return (
    <Box sx={{ mb: 2 }} data-testid="image-instruction-container">
      <img
        src={value}
        alt={altText || "instruction image"}
        data-testid="image-instruction-img"
        style={{ width: "100%", borderRadius: 8 }}
      />
    </Box>
  );
};

export default ImageInstruction;

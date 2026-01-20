import { Box } from "@mui/material";

interface Props {
  value: string;
  altText?: string;
}

const ImageInstruction: React.FC<Props> = ({ value, altText }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <img
        src={value}
        alt={altText || "instruction image"}
        style={{ width: "100%", borderRadius: 8 }}
      />
    </Box>
  );
};

export default ImageInstruction;

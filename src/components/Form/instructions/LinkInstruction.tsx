import { Box, Link } from "@mui/material";

interface Props {
  value: string;
  label?: string;
}

const LinkInstruction: React.FC<Props> = ({ value, label }) => {
  return (
    <Box sx={{ mb: 2 }} data-testid="link-instruction-container">
      <Link href={value} target="_blank" rel="noopener" data-testid="link-instruction-link">
        {label || value}
      </Link>
    </Box>
  );
};

export default LinkInstruction;

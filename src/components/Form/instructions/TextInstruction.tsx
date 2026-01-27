import { Typography } from "@mui/material";

interface Props {
  value: string;
}

const TextInstruction: React.FC<Props> = ({ value }) => {
  return (
    <Typography 
      variant="body1" 
       data-testid="text-instruction"
      sx={{ 
        // mb: 1,
        textAlign: 'center',
        fontWeight: 500
      }}
    >
      {value}
    </Typography>
  );
};

export default TextInstruction;

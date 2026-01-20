import { TextField, MenuItem } from "@mui/material";
import type { Field } from "../../../types/formTypes";

interface Props {
  field: Field;
  value: any;
  error?: string;
  onChange: (id: string, value: any) => void;
}

const DropdownField: React.FC<Props> = ({ field, value, error, onChange }) => {
  return (
    <TextField
      select
      fullWidth
      margin="normal"
      label={field.label}
      required={field.mandatory}
      value={value || ""}
      onChange={(e) => onChange(field.id, e.target.value)}
      error={!!error}
      helperText={error}
       sx={{ mb: 2 }}
    >
      {field.options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropdownField;

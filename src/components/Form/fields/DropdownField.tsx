import { TextField, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Field } from "../../../types/formTypes";

interface Props {
  field: Field;
  value: any;
  error?: string;
  onChange: (id: string, value: any) => void;
}

const DropdownField: React.FC<Props> = ({ field, value, error, onChange }) => {
  const { t } = useTranslation();
  return (
    <TextField
      select
      fullWidth
      margin="normal"
      data-testid={`dropdown-${field.id}`} 
      label={t(`fields.${field.id}.label`, { defaultValue: field.label })}
      required={field.mandatory}
      value={value || ""}
      onChange={(e) => onChange(field.id, e.target.value)}
      error={!!error}
      helperText={error ? t(error, { defaultValue: error }) : undefined}
       sx={{ mb: 2 }}
    >
      {field.options?.map((option) => (
        <MenuItem key={option.value} value={option.value}  data-testid={`dropdown-option-${option.value}`} >
          {t(`fields.${field.id}.options.${option.value}`, {
            defaultValue: option.label,
          })}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropdownField;

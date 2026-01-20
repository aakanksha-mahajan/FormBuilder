import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import type { Field } from "../../../types/formTypes";

interface Props {
  field: Field;
  value: boolean;
  error?: string;
  onChange: (id: string, value: boolean) => void;
}

const CheckboxField: React.FC<Props> = ({
  field,
  value,
  error,
  onChange,
}) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!value}
            onChange={(e) => onChange(field.id, e.target.checked)}
          />
        }
        label={field.label}
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </>
  );
};

export default CheckboxField;

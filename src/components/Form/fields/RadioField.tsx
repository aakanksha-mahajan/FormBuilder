import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Field } from "../../../types/formTypes";

interface Props {
  field: Field;
  value: any;
  error?: string;
  onChange: (id: string, value: any) => void;
}

const RadioField: React.FC<Props> = ({ field, value, error, onChange }) => {
  const { t } = useTranslation();
  return (
    <FormControl error={!!error} component="fieldset" sx={{ mb: 2, display: 'block' }}>
      <FormLabel component="legend" sx={{ fontWeight: 500, mb: 1 }}>
        {t(`fields.${field.id}.label`, { defaultValue: field.label })}
      </FormLabel>
      <RadioGroup 
        row 
        value={value || ""} 
        onChange={(e) => onChange(field.id, e.target.value)}
      >
        {field.options?.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={t(`fields.${field.id}.options.${opt.value}`, {
              defaultValue: opt.label,
            })}
          />
        ))}
      </RadioGroup>
      {error && (
        <FormHelperText>{t(error, { defaultValue: error })}</FormHelperText>
      )}
    </FormControl>
  );
};

export default RadioField;
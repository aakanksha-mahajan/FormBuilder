import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!value}
            onChange={(e) => onChange(field.id, e.target.checked)}
          />
        }
        label={t(`fields.${field.id}.label`, { defaultValue: field.label })}
      />
      {error && (
        <FormHelperText error>
          {t(error, { defaultValue: error })}
        </FormHelperText>
      )}
    </>
  );
};

export default CheckboxField;

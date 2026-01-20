import { TextField as MuiTextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Field } from "../../../types/formTypes";

interface Props {
  field: Field;
  value: any;
  error?: string;
  onChange: (id: string, value: any) => void;
  // Added type prop to support "time" or "text"
  type?: string; 
}

const TextField: React.FC<Props> = ({
  field,
  value,
  error,
  onChange,
  type = "text",
}) => {
  const { t } = useTranslation();
  const isTime = type === "time" || field.type === "time";
  const isCalculated = field.id === "calculatedTime";

  const handleValueChange = (raw: string) => {
    // Prevent numbers/special chars in Full Name as-you-type
    if (field.id === "fullName") {
      const sanitized = raw.replace(/[^a-zA-Z ]+/g, "");
      onChange(field.id, sanitized);
      return;
    }

    onChange(field.id, raw);
  };

  return (
    <MuiTextField
      fullWidth
      // Dynamically set type (will be "time" for your new fields)
      type={isTime ? "time" : type}
      variant="outlined"
      label={t(`fields.${field.id}.label`, {
        defaultValue: field.label,
      })}
      placeholder={t(`fields.${field.id}.placeholder`, {
        defaultValue: field.placeholder,
      })}
      required={field.mandatory}
      value={value || ""}
      onChange={(e) => handleValueChange(e.target.value)}
      error={!!error}
      helperText={error ? t(error, { defaultValue: error }) : undefined}
      // This ensures the label doesn't overlap the clock icon in time fields
      InputLabelProps={{
        shrink: isTime ? true : undefined,
      }}
      InputProps={{
        readOnly: isCalculated,
      }}
      sx={{ 
        mb: 2,
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#ffffff",
          borderRadius: "12px", // Matches your modern theme
        }
      }}
    />
  );
};

export default TextField;
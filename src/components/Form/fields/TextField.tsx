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
  // Added prop for error translation
  translateError?: (error: string) => string;
}

const TextField: React.FC<Props> = ({
  field,
  value,
  error,
  onChange,
  type = "text",
  translateError,
}) => {
  const { t } = useTranslation();
  const isTime = type === "time" || field.type === "time";
  const isDate = type === "date" || field.type === "date";
  const isTextarea = type === "textarea" || field.type === "textarea";
  const isCalculated = field.id === "calculatedTime";

  const handleValueChange = (raw: string) => {
    // Prevent numbers/special chars in Full Name as-you-type
    if (field.id === "fullName") {
      const sanitized = raw.replace(/[^a-zA-Z ]+/g, "");
      onChange(field.id, sanitized);
      return;
    }

    // Phone number: only digits, max 10 characters
    if (field.id === "phone") {
      const sanitized = raw.replace(/[^0-9]/g, "").slice(0, 10);
      onChange(field.id, sanitized);
      return;
    }

    // Date field (DOB): limit year to 4 digits
    if (isDate && raw) {
      // Format: YYYY-MM-DD
      const parts = raw.split("-");
      if (parts[0] && parts[0].length > 4) {
        // Limit year to 4 digits, keep the rest
        const limitedDate = parts[0].slice(0, 4) + (parts[1] ? `-${parts[1]}` : "") + (parts[2] ? `-${parts[2]}` : "");
        onChange(field.id, limitedDate);
        return;
      }
    }

    onChange(field.id, raw);
  };

  return (
    <MuiTextField
      fullWidth
      // Dynamically set type
      type={isTime ? "time" : isDate ? "date" : "text"}
      multiline={isTextarea}
      rows={isTextarea ? 4 : undefined}
      variant="outlined"
      label={t(`fields.${field.id}.label`, {
        defaultValue: field.label,
      })}
      placeholder={field.placeholder ? t(`fields.${field.id}.placeholder`, {
        defaultValue: field.placeholder,
      }) : ""}
      required={field.mandatory}
      value={value || ""}
      onChange={(e) => handleValueChange(e.target.value)}
      error={!!error}
      helperText={error ? (translateError ? translateError(error) : t(error, { defaultValue: error })) : undefined}
      // This ensures the label doesn't overlap for time/date fields
      InputLabelProps={{
        shrink: isTime || isDate ? true : undefined,
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
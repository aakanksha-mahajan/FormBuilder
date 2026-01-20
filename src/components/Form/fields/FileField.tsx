import { Box, Typography, FormHelperText, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Field } from "../../../types/formTypes";

interface Props {
  field: Field;
  value: File | null;
  error?: string;
  onChange: (id: string, value: File | null) => void;
}

const FileField: React.FC<Props> = ({ field, value, error, onChange }) => {
  const { t } = useTranslation();
  const allowedTypes = field.fileConfig?.allowedTypes
    .map((type) => `.${type}`)
    .join(",");

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {t(`fields.${field.id}.label`, { defaultValue: field.label })}
      </Typography>
      <Box sx={{
        border: "2px dashed #cbd5e1",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        bgcolor: "#f8fafc",
        transition: "all 0.2s",
        '&:hover': { bgcolor: '#f1f5f9', borderColor: 'primary.main' }
      }}>
        <input
          type="file"
          id={`file-${field.id}`}
          style={{ display: 'none' }}
          onChange={(e) => onChange(field.id, e.target.files?.[0] || null)}
        />
        <label htmlFor={`file-${field.id}`}>
          <Button variant="text" component="span" sx={{ textTransform: 'none' }}>
            {value
              ? value.name
              : t("file.uploadPrompt", {
                  defaultValue: "Click here to upload file",
                })}
          </Button>
        </label>
      </Box>
      {error && (
        <FormHelperText error>
          {t(error, { defaultValue: error })}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileField;
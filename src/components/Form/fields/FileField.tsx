import { Box, Typography, FormHelperText, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Field } from "../../../types/formTypes";

interface Props {
  field: Field;
  value: File | File[] | null;
  error?: string;
  onChange: (id: string, value: File | File[] | null) => void;
  translateError?: (errorMsg: string) => string;
}

const FileField: React.FC<Props> = ({ field, value, error, onChange, translateError }) => {
  const { t } = useTranslation();

  // Helper function to translate error messages with parameters
  const getErrorMessage = (errorMsg: string): string => {
    if (translateError) {
      return translateError(errorMsg);
    }
    
    if (!errorMsg) return "";
    
    // Check if error message has parameters (format: "key|param1,param2")
    if (errorMsg.includes("|")) {
      const [key, params] = errorMsg.split("|");
      const paramArray = params.split(",");
      
      if (key === "validation.fileTypeNotAllowed") {
        return t(key, { defaultValue: `File type not allowed. Allowed types: ${paramArray[0]}`, types: paramArray[0] });
      }
      if (key === "validation.fileSizeExceeded") {
        return t(key, { defaultValue: `File size exceeds ${paramArray[0]}MB limit`, size: paramArray[0] });
      }
      if (key === "validation.maxFilesExceeded") {
        return t(key, { defaultValue: `Maximum ${paramArray[0]} files allowed`, max: paramArray[0] });
      }
    }
    
    return t(errorMsg, { defaultValue: errorMsg });
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {t(`fields.${field.id}.label`, { defaultValue: field.label })}
        {field.mandatory && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      
      {/* File constraints info */}
      {field.fileConfig && (
        <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: '#666' }}>
          {field.fileConfig.allowedTypes && (
            <>
              Allowed: {field.fileConfig.allowedTypes.join(", ").toUpperCase()}
              {field.fileConfig.maxSizeMB && ` • Max size: ${field.fileConfig.maxSizeMB}MB`}
              {field.fileConfig.multiple && field.fileConfig.maxFiles && ` • Max files: ${field.fileConfig.maxFiles}`}
            </>
          )}
        </Typography>
      )}

      <Box sx={{
        border: error ? "2px dashed #d32f2f" : "2px dashed #cbd5e1",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        bgcolor: error ? "#ffebee" : "#f8fafc",
        transition: "all 0.2s",
        '&:hover': { 
          bgcolor: error ? '#ffebee' : '#f1f5f9', 
          borderColor: error ? '#d32f2f' : 'primary.main' 
        }
      }}>
      <input
        type="file"
          id={`file-${field.id}`}
          style={{ display: 'none' }}
          onChange={(e) => {
            if (field.fileConfig?.multiple) {
              onChange(field.id, Array.from(e.target.files || []) || null);
            } else {
              onChange(field.id, e.target.files?.[0] || null);
            }
          }}
          accept={field.fileConfig?.allowedTypes?.map(ext => `.${ext}`).join(",")}
          multiple={field.fileConfig?.multiple}
        />
        <label htmlFor={`file-${field.id}`}>
          <Button 
            variant="text" 
            component="span" 
            sx={{ 
              textTransform: 'none',
              color: error ? '#d32f2f' : 'inherit'
            }}
          >
            {Array.isArray(value) && value.length > 0
              ? `${value.length} file(s) selected`
              : value
              ? (value as File).name
              : t("file.uploadPrompt", {
                  defaultValue: "Click here to upload file",
                })}
          </Button>
        </label>
      </Box>
      {error && (
        <FormHelperText error sx={{ mt: 1 }}>
          {getErrorMessage(error)}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileField;
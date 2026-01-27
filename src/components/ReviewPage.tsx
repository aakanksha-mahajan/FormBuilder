import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { formJson } from "../data/formJson";

interface ReviewPageProps {
  allFormData: Record<string, any>;
  validationErrors: Record<string, string>;
  onCheckboxChange?: (value: boolean) => void;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ allFormData, validationErrors, onCheckboxChange }) => {
  const { t } = useTranslation();
  const termsAccepted = allFormData.termsAccepted || false;

  // Map all form data to display in review
  const reviewSections = useMemo(() => {
    const sections: Array<{
      stepName: string;
      stepId: string;
      data: Record<string, any>;
    }> = [];

    // Iterate through all steps except the review step (skip null/undefined)
    const reviewSteps = (formJson?.steps || []).filter((step) => step != null && step.stepId !== "review");

    reviewSteps.forEach((step) => {
      const stepData: Record<string, any> = {};
      const stepFields = step?.fields || [];

      stepFields.forEach((field) => {
        if (allFormData[field.id] !== undefined && allFormData[field.id] !== null && allFormData[field.id] !== "") {
          stepData[field.id] = {
            label: t(`fields.${field.id}.label`, { defaultValue: field.label }),
            value: allFormData[field.id],
            field: field,
          };
        }
      });

      if (Object.keys(stepData).length > 0) {
        sections.push({
          stepName: t(`steps.${step.stepId}`, { defaultValue: step.stepName }),
          stepId: step.stepId,
          data: stepData,
        });
      }
    });

    console.log("ReviewPage - reviewSections:", { allFormData, sections });
    return sections;
  }, [allFormData, t]);

  // Helper function to format display value
  const formatValue = (value: any, field: any): string => {
    if (Array.isArray(value)) {
      // Handle array of files
      if (field?.type === "file") {
        const fileNames = value.map((file: any) => {
          if (file && typeof file === "object" && file.name) {
            /* istanbul ignore next */
            return file.name;
          }
          /* istanbul ignore next */
          return String(file);
        });
        return fileNames.join(", ");
      }
      return value.join(", ");
    }

    if (field?.type === "radio" || field?.type === "dropdown") {
      const option = field?.options?.find((opt: any) => opt.value === value);
      return option ? t(`fields.${field.id}.options.${option.value}`, { defaultValue: option.label }) : String(value);
    }

    if (field?.type === "file") {
      if (value && typeof value === "object" && value.name) {
        return value.name;
      }
      return value ? "File uploaded" : "No file";
    }

    if (field?.type === "checkbox" || field?.type === "checkbox-group") {
  return value ? "Yes" : "No";
}


    return String(value);
  };

  const termsError = validationErrors["termsAccepted"];
return (
    <Box sx={{ width: "100%" }} data-testid="review-page-container">
      <Card elevation={0} sx={{ border: "none", borderRadius: 0, boxShadow: "none" }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 1.5, fontWeight: 600, fontSize: "1.3rem" }}>
            {t("steps.review", { defaultValue: "Review & Confirm" })}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: "0.875rem" }}>
            Please review your information below before submitting.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {reviewSections.length > 0 ? (
            reviewSections.map((section, index) => (
              <Box key={section.stepId} sx={{ mb: 3 }} data-testid={`review-section-${section.stepId}`}>
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: "primary.main", fontSize: "0.95rem" }}>
                  {section.stepName}
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 3 }}>
                  {Object.entries(section.data).map(([fieldId, fieldData]: [string, any]) => (
                    <Card key={fieldId} variant="outlined" data-testid={`review-field-${fieldId}`} sx={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", height: "100%" }}>
                      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                          {fieldData.label}
                        </Typography>
                        <Typography variant="body2" data-testid={`review-value-${fieldId}`} sx={{ mt: 0.5, fontWeight: 500, wordBreak: "break-word", color: "#1f2937", fontSize: "0.875rem" }}>
                          {formatValue(fieldData.value, fieldData.field)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
                {index < reviewSections.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))
          ) : (
            <Typography 
              data-testid="no-data-message" 
              color="text.secondary" 
              sx={{ mb: 3, fontStyle: "italic", fontSize: "0.875rem" }}
            >
              No data to review. Please complete the previous steps first.
            </Typography>
          )}

          <Divider sx={{ my: 2.5 }} />

          <Box sx={{ mt: 2.5 }}>
            <Alert severity="info" sx={{ mb: 2, py: 1, fontSize: "0.875rem" }}>
              Please confirm that all the information provided above is accurate and complete.
            </Alert>

            <FormControlLabel
              control={
                <Checkbox
                  data-testid="terms-checkbox"
                  inputProps={{ "data-testid": "terms-checkbox-input" } as any}
                  checked={termsAccepted}
                  onChange={(e) => onCheckboxChange && onCheckboxChange(e.target.checked)}
                />
              }
              label={<Typography>{t("fields.termsAccepted.label", { defaultValue: "I confirm that all information provided is accurate" })}</Typography>}
            />

            {termsError && (
              <Typography 
                data-testid="terms-error-message" 
                variant="caption" 
                color="error" 
                sx={{ display: "block", mt: 1 }}
              >
                {termsError}
              </Typography>
            )}
          </Box>
          <input type="hidden" value={termsAccepted ? "true" : "false"} id="termsAccepted" />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReviewPage;

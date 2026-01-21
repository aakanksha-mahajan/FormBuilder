import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Card,
    CardContent,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import { formJson } from "../../data/formJson";
import type { Field, FormSchema, Instruction } from "../../types/formTypes";
import { validateField } from "./utils/validation";
import { useTranslation } from "react-i18next";
import RadioField from "./fields/RadioField";

// Instruction components
import TextInstruction from "./instructions/TextInstruction";
import ImageInstruction from "./instructions/ImageInstruction";
import VideoInstruction from "./instructions/VideoInstruction";
import LinkInstruction from "./instructions/LinkInstruction";

// Field components
import TextField from "./fields/TextField";
import DropdownField from "./fields/DropdownField";
import CheckboxField from "./fields/CheckboxField";
import FileField from "./fields/FileField";
import ButtonGroup from "./fields/ButtonGroup";

interface Props {
    /** Optional: when omitted, falls back to existing single-page `formJson` */
    schema?: FormSchema;
    /** Optional: prefill values (used by stepper aggregated data) */
    initialData?: Record<string, any>;
    /**
     * Optional: override button actions (used by stepper flow).
     * If provided, it receives the action + current step data after validations pass.
     */
    onAction?: (action: string, data: Record<string, any>) => void;
    /**
     * Optional: callback to get current form data (used by StepperFormUI)
     */
    onFormDataChange?: (data: Record<string, any>) => void;
    /**
     * Optional: validation errors from parent
     */
    validationErrors?: Record<string, string>;
    /**
     * Optional: when step is misconfigured (e.g. null), show this in the fields area instead of config.noFields
     */
    configIssueOverride?: string;
}

const DynamicForm: React.FC<Props> = ({ schema, initialData, onAction, onFormDataChange, validationErrors, configIssueOverride }) => {
    const { t, i18n } = useTranslation();
    const activeSchema = schema ?? formJson;

    const [formData, setFormData] = useState<Record<string, any>>(
        initialData ?? {}
    );
  const [errors, setErrors] = useState<Record<string, string>>(validationErrors ?? {});
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  // Helper function to translate error messages with parameters
  const translateError = (errorMsg: string): string => {
    if (!errorMsg) return "";
    
    // Check if error message has parameters (format: "key|param1,param2")
    if (errorMsg.includes("|")) {
      const [key, params] = errorMsg.split("|");
      const paramArray = params.split(",");
      
      if (key === "validation.minLength") {
        return t(key, { defaultValue: `Minimum ${paramArray[0]} characters required`, min: paramArray[0] });
      }
      if (key === "validation.maxLength") {
        return t(key, { defaultValue: `Maximum ${paramArray[0]} characters allowed`, max: paramArray[0] });
      }
      if (key === "validation.maxFilesExceeded") {
        return t(key, { defaultValue: `Maximum ${paramArray[0]} files allowed`, max: paramArray[0] });
      }
      if (key === "validation.fileSizeExceeded") {
        return t(key, { defaultValue: `File size exceeds ${paramArray[0]}MB limit`, size: paramArray[0] });
      }
      if (key === "validation.fileTypeNotAllowed") {
        return t(key, { defaultValue: `File type not allowed. Allowed types: ${paramArray[0]}`, types: paramArray[0] });
      }
    }
    
    // For regular translation keys
    return t(errorMsg, { defaultValue: errorMsg });
  };

    const instructions = Array.isArray(activeSchema.instructions)
        ? activeSchema.instructions
        : activeSchema.instructions
        ? [activeSchema.instructions]
        : [];
    // Edge cases: fields can be undefined, null, [], or non-array (e.g. {}). Always produce an array of valid field objects.
    const raw =
        activeSchema?.fields ??
        (activeSchema?.steps?.[0]?.fields);
    const fields = (Array.isArray(raw) ? raw : []).filter(
        (f): f is Field => !!f && typeof f === "object" && "id" in f
    );

    // Keep stepper data in sync when switching steps
    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    // Update errors from parent validation
    useEffect(() => {
        if (validationErrors) {
            setErrors(validationErrors);
        }
    }, [validationErrors]);

    // Notify parent of form data changes
    useEffect(() => {
        if (onFormDataChange) {
            onFormDataChange(formData);
        }
    }, [formData, onFormDataChange]);

   
  const handleChange = (id: string, value: any) => {
        setFormData((prev) => {
            const newData = { ...prev, [id]: value };

            // Automatic calculation logic
            if (id === "startTime" || id === "stopTime") {
                const start = newData.startTime;
                const stop = newData.stopTime;

                if (start && stop) {
                    const [startH, startM] = start.split(':').map(Number);
                    const [stopH, stopM] = stop.split(':').map(Number);

                    const startTotal = startH * 60 + startM;
                    const stopTotal = stopH * 60 + stopM;

                    let diff = stopTotal - startTotal;
                    if (diff < 0) diff += 1440; // Handle overnight duration

                    const hours = Math.floor(diff / 60);
                    const mins = diff % 60;
                    newData.calculatedTime = `${hours}h ${mins}m`;
                }
            }
            return newData;
        });
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  
  const renderInstruction = (instruction: Instruction, index: number) => {
    switch (instruction.type) {
      case "text":
                return (
                    <TextInstruction
                        key={index}
                        value={t("instructions.kycText", {
                            defaultValue: instruction.value,
                        })}
                    />
                );

      case "image":
        return (
          <ImageInstruction
            key={index}
            value={instruction.value}
            altText={instruction.altText}
          />
        );

      case "video":
                return (
                    <VideoInstruction
                        key={index}
                        value={instruction.value}
                    />
                );

      case "link":
        return (
          <LinkInstruction
            key={index}
            value={instruction.value}
                        label={t("instructions.guidelines", {
                            defaultValue: instruction.label,
                        })}
          />
        );

      default:
        return null;
    }
  };

   
  const renderField = (field: Field) => {
    const value = formData[field.id];
    const error = errors[field.id];

    switch (field.type) {
      case "text":
            case "time":
            case "date":
        return (
          <TextField
                        key={field.id}
                        field={field}
                        value={value}
                        error={error}
                        onChange={handleChange}
                        type={field.type === "time" ? "time" : field.type === "date" ? "date" : "text"}
                        translateError={translateError}
                    />
                );
            case "radio":  
                return (
                    <RadioField
            key={field.id}
            field={field}
            value={value}
            error={error}
            onChange={handleChange}
          />
        );
      case "dropdown":
        return (
          <DropdownField
            key={field.id}
            field={field}
            value={value}
            error={error}
            onChange={handleChange}
          />
        );

      case "checkbox":
        return (
          <CheckboxField
            key={field.id}
            field={field}
            value={value}
            error={error}
            onChange={handleChange}
          />
        );

      case "textarea":
        return (
          <TextField
            key={field.id}
            field={field}
            value={value}
            error={error}
            onChange={handleChange}
            type="textarea"
          />
        );

      case "file":
        return (
          <FileField
            key={field.id}
            field={field}
            value={value}
            error={error}
            onChange={handleChange}
            translateError={translateError}
          />
        );

      case "buttonGroup":
        return (
          <ButtonGroup
            key={field.id}
            field={field}
            onAction={handleAction}
          />
        );

      default:
        return null;
    }
  };

   
    const runValidation = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    fields.forEach((field) => {
      if (field.type !== "buttonGroup") {
        const error = validateField(field, formData[field.id]);
        if (error) {
          hasError = true;
          newErrors[field.id] = error;
        }
      }
    });

    setErrors(newErrors);

        return hasError;
    };

    
    const handleAction = (action: string) => {
        // For stepper actions (NEXT/BACK), we still want the same validation behavior as submit.
        if (action === "SAVE_DRAFT" || action === "SUBMIT" || action === "NEXT") {
            const hasError = runValidation();
            if (hasError) return;
        }

        // If parent controls actions (stepper flow), delegate after validation
        if (onAction) {
            onAction(action, formData);
            return;
        }

        // Default single-page behavior
        if (action === "SAVE_DRAFT") {
            console.log("Draft saved:", formData);
            return;
        }

        if (action === "SUBMIT") {
            handleSubmit();
        }
    };

   
    const handleSubmit = async () => {
        const hasError = runValidation();
    if (hasError) return;

    try {
      console.log("Submitting data:", formData);

      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

            alert(
                t("responses.success", {
                    defaultValue: activeSchema.successResponse.message,
                })
            );

            if (activeSchema.successResponse.redirect) {
                window.location.href = activeSchema.successResponse.redirect.value;
      }
    } catch (error) {
      setOpenErrorDialog(true);
    }
  };

   

  return (
        <Box sx={{ width: '100%' }}>
            <Card
                elevation={0}
                sx={{
                    border: "none",
                    borderRadius: 0,
                    boxShadow: "none",
                    width: '100%'
                }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                                gap: 2,
                            }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
                                {t("form.title", {
                                    defaultValue: activeSchema.formMeta.formName,
                                })}
</Typography>
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel id="language-select-label">
                                    Language
                                </InputLabel>
                                <Select
                                    labelId="language-select-label"
                                    label="Language"
                                    value={
                                        i18n.language.startsWith("es")
                                            ? "es"
                                            : "en"
                                    }
                                    onChange={(e) =>
                                        i18n.changeLanguage(
                                            String(e.target.value)
                                        )
                                    }
                                >
                                    <MenuItem value="en">English</MenuItem>
                                    <MenuItem value="es">Spanish</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            {t("form.subtitle", {
                                defaultValue:
                                    "Please complete the KYC form. All mandatory fields must be filled.",
                            })}
</Typography>

                        <Divider sx={{ mb: 4 }} />

                        {/* Styled Instructions area */}
      <Box sx={{
                            backgroundColor: "#f1f5f9",
                            p: 2,
                            borderRadius: 3,
    mb: 4,
                            border: "1px solid #e2e8f0"
  }}>
                            {instructions.map(renderInstruction)}
      </Box>

      {/* Fields - config issue appears here when no/empty/invalid fields, so the rest of the form (title, instructions, buttons) stays the same */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {fields.length > 0 ? (
                              fields.map(renderField)
                            ) : (
                              <Typography color="warning.main" sx={{ py: 2, textAlign: 'center' }}>
                                {configIssueOverride ?? t("config.noFields", { defaultValue: "This step does not have any fields configured. Please check the form configuration." })}
                              </Typography>
                            )}
      </Box>

      {/* Failure Dialog */}
                        <Dialog
                            open={openErrorDialog}
                            onClose={() => setOpenErrorDialog(false)}
                        >
                            <DialogTitle>
                                {t("dialog.failureTitle", {
                                    defaultValue: activeSchema.failureResponse.title,
                                })}
                            </DialogTitle>
        <DialogContent>
                                <Typography>
                                    {t("dialog.failureMessage", {
                                        defaultValue: activeSchema.failureResponse.message,
                                    })}
                                </Typography>
        </DialogContent>
      </Dialog>
                </CardContent>
            </Card>
        </Box>
  );
};

export default DynamicForm;

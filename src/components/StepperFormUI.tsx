import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DynamicForm from "./Form/DynamicForm";
import SuccessScreen from "./SuccessScreen";
import ReviewPage from "./ReviewPage";
import type { FormSchema, FormStep } from "../types/formTypes";
import { formJson } from "../data/formJson";
import { validateField } from "./Form/utils/validation";

const StepperFormUI = () => {
  const { t } = useTranslation();
  const steps: FormStep[] = formJson.steps || [];

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formDataByStep, setFormDataByStep] = useState<
    Record<string, Record<string, any>>
  >({});
  const [formDataRef, setFormDataRef] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeStep = steps[activeStepIndex];

  // Clear validation errors when switching steps
  useEffect(() => {
    setValidationErrors({});
  }, [activeStepIndex]);

  // Debounced real-time validation: show field-level errors as user types
  // This validates individual fields after user stops typing for 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formDataRef).length === 0) {
        return; // Skip validation on initial empty state
      }

      const newErrors: Record<string, string> = {};

      activeStep?.fields.forEach((field) => {
        const fieldValue = formDataRef[field.id];
        // Only validate fields with values (user has typed something)
        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== "") {
          const error = validateField(field, fieldValue);
          if (error) {
            newErrors[field.id] = error;
          }
        }
      });

      setValidationErrors(newErrors);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer); // Cleanup timer on each change
  }, [formDataRef, activeStep]);

  // Aggregate all step data
  const aggregatedData = useMemo(() => {
    const merged: Record<string, any> = {};
    Object.values(formDataByStep).forEach((stepData) => {
      Object.assign(merged, stepData);
    });
    return merged;
  }, [formDataByStep]);

  // Create a schema for the current step
  const currentStepSchema: FormSchema = {
    ...formJson,
    fields: activeStep?.fields || [],
    formMeta: {
      ...formJson.formMeta,
      formName: activeStep?.stepName || "Step",
    },
  };

  // Validate current step fields
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    activeStep?.fields.forEach((field) => {
      const fieldValue = formDataRef[field.id];
      const error = validateField(field, fieldValue);
      
      if (error) {
        hasError = true;
        newErrors[field.id] = error;
      }
    });

    console.log("Validation Check:", {
      activeStepId: activeStep?.stepId,
      formDataRef,
      newErrors,
      hasError
    });

    setValidationErrors(newErrors);
    return !hasError;
  };

  const handleNext = () => {
    // Validate before moving to next step
    if (!validateCurrentStep()) {
      return;
    }

    // Store current step data from the form
    setFormDataByStep((prev) => ({
      ...prev,
      [activeStep.stepId]: formDataRef,
    }));

    // Move to next step
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
      setValidationErrors({});
      // Reset formDataRef for the new step (it will be populated from aggregatedData via initialData)
      setFormDataRef({});
    }
  };

  const handleBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
      setValidationErrors({});
      // Reset formDataRef for the previous step
      setFormDataRef({});
    }
  };

  const handleSubmit = () => {
    // Validate before submitting
    if (!validateCurrentStep()) {
      return;
    }

    // Store final step data
    setFormDataByStep((prev) => ({
      ...prev,
      [activeStep.stepId]: formDataRef,
    }));

    // Merge all data
    const finalData = {
      ...aggregatedData,
      ...formDataRef,
    };

    console.log("Form validated and ready for submission:", finalData);

    // Show success screen (API integration will be added later)
    setIsSubmitted(true);
  };

  const isLastStep = activeStepIndex === steps.length - 1;

  // Show success screen if form was submitted
  if (isSubmitted && formJson.successResponse) {
    return (
      <SuccessScreen
        title={formJson.successResponse.title || "Success"}
        message={formJson.successResponse.message || "Your application has been submitted successfully"}
        actions={formJson.successResponse.actions}
      />
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        px: 2, 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ maxWidth: 900, width: '100%' }}>
          {/* Stepper */}
          <Stepper activeStep={activeStepIndex} sx={{ mb: 6, mt: 6 }}>
            {steps.map((step) => (
              <Step key={step.stepId}>
                <StepLabel>
                  {t(`steps.${step.stepId}`, { defaultValue: step.stepName })}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Current Step Form or Review Page */}
          {activeStep ? (
            <Box sx={{ mt: 6 }}>
              {/* Check if step has fields */}
              {(!activeStep.fields || activeStep.fields.length === 0) && activeStep.stepId !== "review" ? (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    No Fields Configured
                  </Typography>
                  <Typography variant="body2">
                    The step "{activeStep.stepName}" doesn't have any fields configured. Please check the JSON configuration.
                  </Typography>
                </Alert>
              ) : (
                <>
                  {/* Validation Error Alert - Top of Form (only show on non-review steps) */}
                  {activeStep.stepId !== "review" && Object.keys(validationErrors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {t("validation.allFieldsRequired", { defaultValue: "Please fill in all required fields" })}
                    </Alert>
                  )}

                  {/* Render ReviewPage for review step, DynamicForm for others */}
                  {activeStep.stepId === "review" ? (
                    <ReviewPage
                      allFormData={{
                        ...aggregatedData,
                        ...formDataRef,
                      }}
                      validationErrors={validationErrors}
                      onCheckboxChange={(checked) => {
                        setFormDataRef((prev) => ({
                          ...prev,
                          termsAccepted: checked,
                        }));
                      }}
                    />
                  ) : (
                    <DynamicForm
                      schema={currentStepSchema}
                      initialData={aggregatedData}
                      onFormDataChange={setFormDataRef}
                      validationErrors={validationErrors}
                    />
                  )}
                </>
              )}

              {/* Navigation Buttons - Right side of form */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                {activeStepIndex > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ minWidth: 100 }}
                  >
                    {t("buttons.back", { defaultValue: "Back" })}
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (isLastStep) {
                      handleSubmit();
                    } else {
                      handleNext();
                    }
                  }}
                  sx={{ minWidth: 100 }}
                >
                  {isLastStep 
                    ? t("buttons.submit", { defaultValue: "Submit" })
                    : t("buttons.next", { defaultValue: "Next" })}
                </Button>
              </Box>
            </Box>
          ) : (
            <Alert severity="error" sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Step Not Found
              </Typography>
              <Typography variant="body2">
                The current step could not be loaded. Please refresh the page or check your configuration.
              </Typography>
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StepperFormUI;

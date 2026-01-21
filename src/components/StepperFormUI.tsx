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
import type { Field, FormSchema, FormStep } from "../types/formTypes";
import { formJson } from "../data/formJson";
import { validateField } from "./Form/utils/validation";

// Filter to valid steps only (non-null, has stepId) so missing/malformed entries don't break the UI
const getValidSteps = (): FormStep[] =>
  (formJson?.steps || []).filter((s): s is FormStep => !!(s != null && (s as FormStep).stepId));

const StepperFormUI = () => {
  const { t } = useTranslation();
  const steps: FormStep[] = useMemo(() => getValidSteps(), []);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formDataByStep, setFormDataByStep] = useState<
    Record<string, Record<string, any>>
  >({});
  const [formDataRef, setFormDataRef] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const safeStepIndex = steps.length === 0 ? 0 : Math.min(activeStepIndex, steps.length - 1);
  const activeStep = steps[safeStepIndex] ?? null;

  // Normalize fields: undefined, null, non-array, or entries without id/type can break the UI. Use only valid field objects.
  const stepFields = useMemo(
    () =>
      (Array.isArray(activeStep?.fields) ? activeStep.fields : []).filter(
        (f): f is Field => !!f && typeof f === "object" && "id" in f
      ),
    [activeStep?.fields]
  );

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
      if (!stepFields.length) {
        return; // No fields to validate (e.g. configuration issue)
      }

      const newErrors: Record<string, string> = {};

      stepFields.forEach((field) => {
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

  // Create a schema for the current step (stepFields is already normalized)
  const currentStepSchema: FormSchema = {
    ...formJson,
    fields: stepFields,
    formMeta: {
      ...formJson.formMeta,
      formName: activeStep?.stepName || "Step",
    },
  };

  // Validate current step fields
  const validateCurrentStep = (): boolean => {
    if (!stepFields.length) return true; // No fields or misconfigured step: allow navigation

    const newErrors: Record<string, string> = {};
    let hasError = false;

    stepFields.forEach((field) => {
      const fieldValue = formDataRef[field.id];
      const error = validateField(field, fieldValue);

      if (error) {
        hasError = true;
        newErrors[field.id] = error;
      }
    });

    setValidationErrors(newErrors);
    return !hasError;
  };

  const handleNext = () => {
    // Validate before moving to next step (no-op when step has no fields / misconfigured)
    if (!validateCurrentStep()) return;

    // Store current step data only when step is properly configured
    if (activeStep?.stepId) {
      setFormDataByStep((prev) => ({
        ...prev,
        [activeStep.stepId]: formDataRef,
      }));
    }

    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((i) => Math.min(i + 1, steps.length - 1));
      setValidationErrors({});
      setFormDataRef({});
    }
  };

  const handleBack = () => {
    if (safeStepIndex > 0) {
      setActiveStepIndex((i) => Math.max(0, Math.min(i, steps.length - 1) - 1));
      setValidationErrors({});
      setFormDataRef({});
    }
  };

  const handleSubmit = () => {
    if (!activeStep) return; // Misconfigured or out-of-bounds step: do not submit
    if (!validateCurrentStep()) return;

    if (activeStep.stepId) {
      setFormDataByStep((prev) => ({
        ...prev,
        [activeStep.stepId]: formDataRef,
      }));
    }

    const finalData = { ...aggregatedData, ...formDataRef };
    console.log("Form validated and ready for submission:", finalData);
    setIsSubmitted(true);
  };

  const isLastStep = safeStepIndex === steps.length - 1;

  // Show success screen if form was submitted
  if (isSubmitted && formJson?.successResponse) {
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
          {steps.length === 0 ? (
            /* No steps at all: show configuration issue only, no stepper/buttons */
            <Alert severity="warning" sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {t("config.title", { defaultValue: "Configuration issue" })}
              </Typography>
              <Typography variant="body2">
                {t("config.noSteps", { defaultValue: "No steps are configured for this form. Please check the form configuration." })}
              </Typography>
            </Alert>
          ) : (
            <>
              {/* Stepper - always shown when we have at least one step */}
              <Stepper activeStep={safeStepIndex} sx={{ mb: 6, mt: 6 }}>
                {steps.map((step) => (
                  <Step key={step.stepId}>
                    <StepLabel>
                      {t(`steps.${step.stepId}`, { defaultValue: step.stepName })}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Current Step: form (DynamicForm) or review. Config issue appears only in the fields area so stepper and buttons stay in place. */}
              <Box sx={{ mt: 6 }}>
                {activeStep?.stepId === "review" ? (
                  <ReviewPage
                    allFormData={{ ...aggregatedData, ...formDataRef }}
                    validationErrors={validationErrors}
                    onCheckboxChange={(checked) => {
                      setFormDataRef((prev) => ({ ...prev, termsAccepted: checked }));
                    }}
                  />
                ) : (
                  <>
                    {Object.keys(validationErrors).length > 0 && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {t("validation.allFieldsRequired", { defaultValue: "Please fill in all required fields" })}
                      </Alert>
                    )}
                    <DynamicForm
                      schema={currentStepSchema}
                      initialData={aggregatedData}
                      onFormDataChange={setFormDataRef}
                      validationErrors={validationErrors}
                      configIssueOverride={!activeStep ? t("config.stepNotConfigured", { defaultValue: "This step is not properly configured. Please check the form configuration." }) : undefined}
                    />
                  </>
                )}

                {/* Navigation Buttons - always shown when we have steps, same position */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  {safeStepIndex > 0 && (
                    <Button variant="outlined" onClick={handleBack} sx={{ minWidth: 100 }}>
                      {t("buttons.back", { defaultValue: "Back" })}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => (isLastStep ? handleSubmit() : handleNext())}
                    sx={{ minWidth: 100 }}
                  >
                    {isLastStep ? t("buttons.submit", { defaultValue: "Submit" }) : t("buttons.next", { defaultValue: "Next" })}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StepperFormUI;

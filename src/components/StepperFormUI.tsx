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

  
  const stepFields = useMemo(
    () =>
      (Array.isArray(activeStep?.fields) ? activeStep.fields : []).filter(
        (f): f is Field => !!f && typeof f === "object" && "id" in f
      ),
    [activeStep?.fields]
  );

 
  useEffect(() => {
    setValidationErrors({});
  }, [activeStepIndex]);

 
useEffect(() => {
  const timer = setTimeout(() => {
    /* istanbul ignore next */
    if (Object.keys(formDataRef).length === 0) {
      return;
    }

    /* istanbul ignore next */
    if (!stepFields.length) {
      return;
    }

    const newErrors: Record<string, string> = {};
    stepFields.forEach((field) => {
      const fieldValue = formDataRef[field.id];
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== "") {
        const error = validateField(field, fieldValue);
        if (error) newErrors[field.id] = error;
      }
    });

    setValidationErrors(newErrors);
  }, 500);

  /* istanbul ignore next */
return () => clearTimeout(timer);

}, [formDataRef, activeStep]);


  // Aggregate all step data
  const aggregatedData = useMemo(() => {
    const merged: Record<string, any> = {};
    Object.values(formDataByStep).forEach((stepData) => {
      Object.assign(merged, stepData);
    });
    return merged;
  }, [formDataByStep]);

  
  const currentStepSchema: FormSchema = {
    ...formJson,
    fields: stepFields,
    formMeta: {
      ...formJson.formMeta,
      formName: activeStep?.stepName || "Step",
    },
  };

 
  const validateCurrentStep = (): boolean => {
    if (!stepFields.length) return true; 

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
   
    if (!validateCurrentStep()) return;

   
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
    if (!activeStep) return; 
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

  
  /* istanbul ignore next */
if (isSubmitted && formJson?.successResponse) {
  const finalData = { ...aggregatedData, ...formDataRef };
  return ( 
    <Box data-testid="success-screen">
  <SuccessScreen
   title={formJson.successResponse.title || "Success"}
    message={formJson.successResponse.message || "Your application has been submitted successfully"}
    actions={formJson.successResponse.actions}
    submittedData={finalData}
  />
  </Box>
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
            
              <Stepper 
              data-testid="stepper"
              activeStep={safeStepIndex} sx={{ mb: 6, mt: 6 }}>
                {steps.map((step) => (
                  <Step key={step.stepId}>
                    <StepLabel
                    data-testid={`step-label-${step.stepId}`}
                    >
                      {t(`steps.${step.stepId}`, { defaultValue: step.stepName })}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

          
              <Box sx={{ mt: 6 }}>
                {activeStep?.stepId === "review" ? (
                   <Box data-testid="review-step">
                  <ReviewPage
                    allFormData={{ ...aggregatedData, ...formDataRef }}
                    validationErrors={validationErrors}
                    onCheckboxChange={(checked) => {
                      setFormDataRef((prev) => ({ ...prev, termsAccepted: checked }));
                    }}
                  />
                    </Box>
                ) : (
                  <>
                    {Object.keys(validationErrors).length > 0 && (
                      <Alert severity="error" sx={{ mb: 3 }}
                      data-testid="validation-error"
                      >
                        {t("validation.allFieldsRequired", { defaultValue: "Please fill in all required fields" })}
                      </Alert>
                    )}
                    <Box data-testid="form-step">
                    <DynamicForm
                      schema={currentStepSchema}
                      initialData={aggregatedData}
                      onFormDataChange={setFormDataRef}
                      validationErrors={validationErrors}
                      configIssueOverride={!activeStep ? t("config.stepNotConfigured", { defaultValue: "This step is not properly configured. Please check the form configuration." }) : undefined}
                    />
                    </Box>
                  </>
                  
                )}

                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}
                 data-testid="navigation-buttons"
                >
                  {safeStepIndex > 0 && (
                    <Button variant="outlined" onClick={handleBack} sx={{ minWidth: 100 }}
                     data-testid="back-button"
                    >
                      {t("buttons.back", { defaultValue: "Back" })}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => (isLastStep ? handleSubmit() : handleNext())}
                    sx={{ minWidth: 100 }}
                     data-testid={isLastStep ? "submit-button" : "next-button"}
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

import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Card,
    CardContent,
    Divider,
    Button,
} from "@mui/material";

import { formJson } from "../../data/formJson";
import type { Field, Instruction } from "../../types/formTypes";
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

const DynamicForm = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openErrorDialog, setOpenErrorDialog] = useState(false);


   
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
                return (
                    <TextField
                        key={field.id}
                        field={field}
                        value={value}
                        error={error}
                        onChange={handleChange}
                        type={field.type === "time" ? "time" : "text"}
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

            case "file":
                return (
                    <FileField
                        key={field.id}
                        field={field}
                        value={value}
                        error={error}
                        onChange={handleChange}
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

        formJson.fields.forEach((field) => {
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
        if (action === "SAVE_DRAFT") {
            const hasError = runValidation();
            if (hasError) return;
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
                    defaultValue: formJson.successResponse.message,
                })
            );

            if (formJson.successResponse.redirect) {
                window.location.href = formJson.successResponse.redirect.value;
            }
        } catch (error) {
            setOpenErrorDialog(true);
        }
    };

   
    
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 4,
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
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
                                    defaultValue: formJson.formMeta.formName,
                                })}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    size="small"
                                    variant={
                                        i18n.language.startsWith("en")
                                            ? "contained"
                                            : "outlined"
                                    }
                                    onClick={() => i18n.changeLanguage("en")}
                                >
                                    EN
                                </Button>
                                <Button
                                    size="small"
                                    variant={
                                        i18n.language.startsWith("es")
                                            ? "contained"
                                            : "outlined"
                                    }
                                    onClick={() => i18n.changeLanguage("es")}
                                >
                                    ES
                                </Button>
                            </Box>
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
                            p: 3,
                            borderRadius: 3,
                            mb: 4,
                            border: "1px solid #e2e8f0"
                        }}>
                            {formJson.instructions.map(renderInstruction)}
                        </Box>

                        {/* Fields */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {formJson.fields.map(renderField)}
                        </Box>

                        {/* Failure Dialog */}
                        <Dialog
                            open={openErrorDialog}
                            onClose={() => setOpenErrorDialog(false)}
                        >
                            <DialogTitle>
                                {t("dialog.failureTitle", {
                                    defaultValue: formJson.failureResponse.title,
                                })}
                            </DialogTitle>
                            <DialogContent>
                                <Typography>
                                    {t("dialog.failureMessage", {
                                        defaultValue: formJson.failureResponse.message,
                                    })}
                                </Typography>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default DynamicForm;

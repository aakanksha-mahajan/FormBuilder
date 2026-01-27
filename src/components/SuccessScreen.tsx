import { useRef, useState, useMemo } from "react";
import { Box, Typography, Button, Card, CardContent, Alert, Divider } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";
import { formJson } from "../data/formJson";

interface SuccessScreenProps {
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    action: string;
    value?: string;
  }>;
  submittedData?: Record<string, any>;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  title,
  message,
  actions,
  submittedData,
}) => {
  const { t } = useTranslation();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

 
  const formDataSections = useMemo(() => {
    if (!submittedData || Object.keys(submittedData).length === 0) return [];

   
    const formatValueForPDF = (value: any, field: any): string => {
      if (Array.isArray(value)) {
        if (field?.type === "file") {
          const fileNames = value.map((file: any) => {
            if (file && typeof file === "object" && file.name) {
              return file.name;
            }
            return String(file);
          });
          return fileNames.join(", ");
        }
        return value.join(", ");
      }

      if (field?.type === "radio" || field?.type === "dropdown") {
        const option = field?.options?.find((opt: any) => opt.value === value);
        return option
          ? t(`fields.${field.id}.options.${option.value}`, { defaultValue: option.label })
          : String(value);
      }

      if (field?.type === "file") {
        if (value && typeof value === "object" && value.name) {
          return value.name;
        }
        return value ? "File uploaded" : "No file";
      }

      if (field?.type === "checkbox") {
        return value ? "Yes" : "No";
      }

      return String(value);
    };

    const sections: Array<{
      stepName: string;
      stepId: string;
      data: Array<{ label: string; value: string; field: any }>;
    }> = [];

 
    const formSteps = (formJson?.steps || []).filter(
      (step) => step != null && step.stepId !== "review"
    );

    formSteps.forEach((step) => {
      const stepData: Array<{ label: string; value: string; field: any }> = [];
      const stepFields = step?.fields || [];

      stepFields.forEach((field) => {
        const value = submittedData[field.id];
        if (value !== undefined && value !== null && value !== "") {
          stepData.push({
            label: t(`fields.${field.id}.label`, { defaultValue: field.label || field.id }),
            value: formatValueForPDF(value, field),
            field: field,
          });
        }
      });

      if (stepData.length > 0) {
        sections.push({
          stepName: t(`steps.${step.stepId}`, { defaultValue: step.stepName || step.stepId }),
          stepId: step.stepId,
          data: stepData,
        });
      }
    });

    return sections;
  }, [submittedData, t]);

  const handleAction = async (action: string, value?: string) => {
   if (action === "REDIRECT" && value) {
  window.location.assign(value); 
}else if (action === "DOWNLOAD_PDF") {
      const element = pdfRef.current;
      if (!element) {
        console.error("PDF ref element not found");
        return;
      }
      
      if (formDataSections.length === 0) {
        console.warn("No form data sections to include in PDF");
        alert("No form data available to download");
        return;
      }
      
      setIsGeneratingPdf(true);
      
      try {
        // Clone the element to avoid blinking on screen
        const clone = element.cloneNode(true) as HTMLElement;
        
        // Create a hidden container for the clone
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.left = "-9999px";
        container.style.top = "0";
        container.style.width = "210mm";
        container.style.maxWidth = "210mm";
        container.style.backgroundColor = "#fff";
        container.style.padding = "20px";
        container.style.opacity = "1";
        container.style.visibility = "visible";
        container.style.zIndex = "-1";
        
        // Apply styles to clone to ensure proper rendering
        clone.style.width = "100%";
        clone.style.maxWidth = "100%";
        clone.style.backgroundColor = "#fff";
        clone.style.color = "#000";
        clone.style.position = "relative";
        clone.style.left = "0";
        clone.style.top = "0";
        
        container.appendChild(clone);
        document.body.appendChild(container);
        
     
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Capture as canvas
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: container.scrollWidth,
          height: container.scrollHeight,
        });
        
        // Create PDF
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate ratio to fit on single page with margins
        const margin = 10; // 10mm margin on all sides
        const maxWidth = pdfWidth - (margin * 2);
        const maxHeight = pdfHeight - (margin * 2);
        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        
        const imgScaledWidth = imgWidth * ratio;
        const imgScaledHeight = imgHeight * ratio;
        const marginX = (pdfWidth - imgScaledWidth) / 2;
        const marginY = margin;
        
       
        pdf.addImage(imgData, "PNG", marginX, marginY, imgScaledWidth, imgScaledHeight);
        
        // Save PDF
        const filename = `application-submitted-${new Date().toISOString().slice(0, 10)}.pdf`;
        pdf.save(filename);
        
      
        document.body.removeChild(container);
        
        console.log("PDF generated successfully");
      } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setIsGeneratingPdf(false);
      }
    }
  };

  return (
    <Box
     data-testid="success-screen-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
       
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 2,
              borderRadius: 1,
            }}
          >
           
            <Box
              sx={{
                fontSize: 80,
                color: "#4caf50",
                mb: 2,
                fontWeight: "bold",
              }}
            >
              ✓
            </Box>

            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#1a1a1a",
              }}
            >
              {title}
            </Typography>


            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>

          
            <Alert severity="success" sx={{ mb: 0 }}>
              Your application has been received successfully
            </Alert>
          </Box>

         
          {actions && actions.length > 0 && (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mt: 3 }}>
              {actions.map((btn, index) => (
                <Button
                  key={index}
                  data-testid={`action-btn-${index}`}
                  variant={index === 0 ? "contained" : "outlined"}
                  color="primary"
                  disabled={btn.action === "DOWNLOAD_PDF" && isGeneratingPdf}
                  onClick={() => handleAction(btn.action, btn.value)}
                  sx={{ minWidth: 150 }}
                >
                  {btn.label}
                </Button>
              ))}
            </Box>
          )}

         
          <Box
            ref={pdfRef}
            data-testid="pdf-content"
            sx={{
              position: "absolute",
              left: "-9999px",
              width: "210mm", 
              maxWidth: "210mm",
              backgroundColor: "#fff",
              p: 3,
              "@media print": {
                position: "relative",
                left: "0",
                width: "100%",
                maxWidth: "100%",
              },
            }}
          >
         
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  fontSize: 60,
                  color: "#4caf50",
                  mb: 1.5,
                  fontWeight: "bold",
                }}
              >
                ✓
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "#1a1a1a",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                {message}
              </Typography>
              <Alert severity="success" sx={{ mb: 0 }}>
                Your application has been received successfully
              </Alert>
            </Box>

           
            {formDataSections.length > 0 ? (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: "#1a1a1a",
                    fontSize: "1.25rem",
                  }}
                >
                  Application Details
                </Typography>

                {formDataSections.map((section, sectionIndex) => (
                  <Box key={section.stepId} sx={{ mb: sectionIndex < formDataSections.length - 1 ? 3 : 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "primary.main",
                        fontSize: "1rem",
                      }}
                    >
                      {section.stepName}
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {section.data.map((item, itemIndex) => (
                        <Box
                          key={itemIndex}
                          sx={{
                            borderLeft: "3px solid #e0e0e0",
                            pl: 2,
                            py: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#666",
                              fontSize: "0.875rem",
                              mb: 0.5,
                            }}
                          >
                            {item.label}:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#1a1a1a",
                              fontSize: "0.9rem",
                              wordBreak: "break-word",
                            }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {sectionIndex < formDataSections.length - 1 && (
                      <Divider sx={{ mt: 2.5 }} />
                    )}
                  </Box>
                ))}

                <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Submitted on: {new Date().toLocaleString()}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No form data available
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuccessScreen;

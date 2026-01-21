import { useRef, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Alert } from "@mui/material";
import html2pdf from "html2pdf.js";

interface SuccessScreenProps {
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    action: string;
    value?: string;
  }>;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  title,
  message,
  actions,
}) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleAction = (action: string, value?: string) => {
    if (action === "REDIRECT" && value) {
      window.location.href = value;
    } else if (action === "DOWNLOAD_PDF") {
      const el = pdfRef.current;
      if (!el) return;
      setIsGeneratingPdf(true);
      const filename = `application-submitted-${new Date().toISOString().slice(0, 10)}.pdf`;
      html2pdf()
        .set({
          margin: 12,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(el)
        .save()
        .catch((err) => console.error("PDF generation failed:", err))
        .finally(() => setIsGeneratingPdf(false));
    }
  };

  return (
    <Box
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
          {/* Content used for PDF (excludes action buttons) */}
          <Box
            ref={pdfRef}
            sx={{
              backgroundColor: "#fff",
              p: 2,
              borderRadius: 1,
            }}
          >
            {/* Success Checkmark */}
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

            {/* Title */}
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

            {/* Message */}
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

            {/* Success Alert */}
            <Alert severity="success" sx={{ mb: 0 }}>
              Your application has been received successfully
            </Alert>
          </Box>

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mt: 3 }}>
              {actions.map((btn, index) => (
                <Button
                  key={index}
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuccessScreen;

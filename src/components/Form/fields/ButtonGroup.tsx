import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Field } from "../../../types/formTypes";

interface Props {
    field: Field;
    onAction: (action: string) => void;
}

const ButtonGroup: React.FC<Props> = ({ field, onAction }) => {
    const { t } = useTranslation();
    return (
        <Box 
        data-testid="button-group-container"
        sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
        }}>
            {field.buttons?.map((btn,index) => (
                <Button 
                key={btn.label}
          data-testid={`action-btn-${index}`}
                variant={btn.primary ? "contained" : "outlined"}
                    sx={{
                        textTransform: "none",
                        px: 4,
                    }}
                    onClick={() => onAction(btn.action)}
                >
                    {t(`buttons.${btn.action}`, { defaultValue: btn.label })}
                </Button>
            ))}
        </Box>
    );
};

export default ButtonGroup;

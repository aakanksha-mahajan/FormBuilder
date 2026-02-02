import React from 'react';
import { Paper, Typography, Stack, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ApprovalProps {
  status: string;
  audit?: {
    lastUpdatedAt: string;
  };
}

export const ApprovalBanner: React.FC<ApprovalProps> = ({ status, audit }) => {
  // Only show this banner if the status is approved or completed
  if (status !== 'approved' && status !== 'COMPLETED_APPROVED') return null;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        mt: 4, 
        p: 3, 
        borderRadius: 2, 
        bgcolor: '#ecfdf3', // Light green background from your screenshot
        border: '1px solid #abefc6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <Stack spacing={1} alignItems="center">
        <CheckCircleIcon sx={{ color: '#12b76a', fontSize: 32 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#027a48' }}>
            Stage Approved
          </Typography>
          <Typography variant="caption" sx={{ color: '#067647', display: 'block' }}>
            Completed on {audit ? new Date(audit.lastUpdatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
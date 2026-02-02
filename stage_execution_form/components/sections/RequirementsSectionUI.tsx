import React from 'react';
import { Box, Typography, Stack, Checkbox, FormControlLabel, Paper } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import type { RequirementsSection } from '../../types/stageTypes';

interface RequirementsProps {
  data: RequirementsSection;
  onUpdate: (sectionId: string, itemId: string, key: string, newValue: any) => void;
}

export const RequirementsSectionUI: React.FC<RequirementsProps> = ({ data, onUpdate }) => {
  const sectionId = data.id;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Section Header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <AssignmentTurnedInIcon sx={{ color: '#2e90fa', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#101828' }}>
          {data.title}
        </Typography>
      </Stack>

      {/* Checkbox Container (Matching the reference UI style) */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          bgcolor: '#f8faff', 
          border: '1px solid #eaecf0' 
        }}
      >
        <Stack spacing={1}>
          {data.items.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              variant="outlined"
              sx={{ 
                px: 2, 
                py: 1, 
                borderRadius: 1.5, 
                bgcolor: 'white',
                border: '1px solid #eaecf0'
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small"
                    // Checking if status is 'COMPLETED' from JSON/State
                    checked={item.status === 'COMPLETED'} 
                    onChange={(e) => {
                      const newStatus = e.target.checked ? 'COMPLETED' : 'PENDING';
                      // Calling the main update function
                      onUpdate(sectionId, item.id, 'status', newStatus);
                    }}
                    sx={{ color: '#d0d5dd', '&.Mui-checked': { color: '#2e90fa' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#344054' }}>
                    {item.label} {item.required && <span style={{ color: '#f04438' }}>*</span>}
                  </Typography>
                }
              />
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};
// NotesSectionUI.tsx

import React from 'react';
import { Box, Typography, TextField, Stack } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';

interface NotesProps {
  data: any; 
  onUpdate: (sectionId: string, itemId: string, key: string, value: any) => void;
  locked: boolean;
}

export const NotesSectionUI: React.FC<NotesProps> = ({ data, onUpdate, locked }) => {
  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <NotesIcon sx={{ color: '#667085', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#101828' }}>
          {data.title || "Additional Notes"}
        </Typography>
      </Stack>

      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Add any additional observations or notes here..."
        disabled={locked}
        value={data.value || ""}
        onChange={(e) => onUpdate(data.id, "", "value", e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: '#f9fafb',
            '& fieldset': { borderColor: '#eaecf0' },
            fontSize: '0.875rem'
          }
        }}
      />
    </Box>
  );
};
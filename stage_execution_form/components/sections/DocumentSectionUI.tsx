import React from 'react';
import { Paper, Typography, Box, Stack, List, ListItem, ListItemIcon, IconButton } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { DocumentSection } from '../../types/stageTypes';

export const DocumentSectionUI: React.FC<{ data: DocumentSection }> = ({ data }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Section Header with Blue Icon */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', color: '#2e90fa' }}>
           <InsertDriveFileIcon fontSize="small" />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#101828' }}>
          {data.title}
        </Typography>
      </Stack>

      {/* Light Blue Container wrapping the white file cards */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 1.5,
          borderRadius: 2, 
          bgcolor: '#f8faff', 
          border: '1px solid #eaecf0'
        }}
      >
        <List disablePadding>
          {data.items.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              variant="outlined"
              sx={{ 
                mb: 1, 
                '&:last-child': { mb: 0 },
                borderRadius: 1.5,
                bgcolor: 'white',
                border: '1px solid #eaecf0'
              }}
            >
              <ListItem 
                secondaryAction={
                  <IconButton edge="end" size="small">
                    <VisibilityIcon sx={{ fontSize: 18, color: '#667085' }} />
                  </IconButton>
                }
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <InsertDriveFileIcon sx={{ color: '#98a2b3' }} />
                </ListItemIcon>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#344054' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#667085' }}>
                    {/* Mapping file size logic to match your UI requirements */}
                    {item.id === 'bom' ? 'Excel Spreadsheet • 245 KB' : 'Image • 1.2 MB'}
                  </Typography>
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
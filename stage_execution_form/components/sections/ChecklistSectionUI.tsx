import React from 'react';
import { Box, Typography, Stack, TextField, Chip, Button, Paper, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { ChecklistSection } from '../../types/stageTypes';

interface ChecklistProps {
    data: ChecklistSection;
    locked: boolean;
    onUpdate: (sectionId: string, itemId: string, key: string, newValue: any) => void;
    onAddEvidence: (sectionId: string, itemId: string) => void;
}

export const ChecklistSectionUI: React.FC<ChecklistProps> = ({ data, locked, onUpdate, onAddEvidence }) => {
    const sectionId = data.id;

    return (
        <Box sx={{ mb: 4 }}>
            {/* Section Header with Progress Count */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleOutlineIcon sx={{ color: '#12b76a', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#101828' }}>
                        {data.title}
                    </Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#667085' }}>
                    {/* Progress calculate logic */}
                    {data.items.filter(i => i.response?.status === 'COMPLETED').length} / {data.items.length} completed
                </Typography>
            </Stack>

            {data.items.map((item) => (
                <Box key={item.id} sx={{ mb: 4, pb: 2, borderBottom: '1px solid #f2f4f7' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#344054', flex: 1 }}>
                            {item.question} {item.required && <span style={{ color: '#f04438' }}>*</span>}
                        </Typography>

                        {/* 1. Status Toggle Logic */}
                        <Chip
                            label={item.response?.status || "Pending"}
                            size="small"
                            onClick={() => {
                                if (locked) return;
                                const nextStatus = item.response?.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
                                onUpdate(sectionId, item.id, 'status', nextStatus);
                            }}
                            sx={{
                                borderRadius: 1,
                                fontWeight: 600,
                                cursor: locked ? 'default' : 'pointer',
                                bgcolor: item.response?.status === 'COMPLETED' ? '#ecfdf3' : '#f9fafb',
                                color: item.response?.status === 'COMPLETED' ? '#027a48' : '#667085',
                                border: `1px solid ${item.response?.status === 'COMPLETED' ? '#abefc6' : '#eaecf0'}`
                            }}
                        />
                    </Stack>

                    {/* 2. Observation Text Logic */}
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Enter observation/comment here..."
                        value={item.response?.comment || ""}
                        disabled={locked}
                        onChange={(e) => onUpdate(sectionId, item.id, 'comment', e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: '#f9fafb',
                                '& fieldset': { borderColor: '#eaecf0' }
                            }
                        }}
                    />

                    {/* Timestamp Display (From Reference Image) */}
                    {item.response?.completedAt && (
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1, color: '#667085' }}>
                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                                {new Date(item.response.completedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </Typography>
                        </Stack>
                    )}

                    {/* 3. Evidence UI (As per screenshot) */}
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<PhotoCameraIcon />}
                            size="small"
                            disabled={locked}
                            onClick={() => onAddEvidence(sectionId, item.id)} 
                            sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#d0d5dd', color: '#344054' }}
                        >
                            Add Evidence
                        </Button>

                        {item.evidence && item.evidence.length > 0 && (
                            <Paper variant="outlined" sx={{ mt: 1.5, p: 1, borderRadius: 2, bgcolor: '#f9fafb' }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <PhotoCameraIcon sx={{ fontSize: 18, color: '#98a2b3' }} />
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                                                {item.evidence[0].fileName}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Uploaded recently • {item.evidence[0].fileSizeKB} KB
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                </Stack>
                            </Paper>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};
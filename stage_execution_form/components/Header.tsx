import React from 'react';
import { Typography, Box, Grid, Stack, Divider, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface HeaderProps {
    header: {
        title: string;
        description: string;
        operator: { type: string; value: string };
        startedAt: string;
    };
    context: {
        product: string;
        workOrderId: string;
        stageNumber: number;
        totalStages: number;
    };
    status: string;
    canFinish: boolean;
    // showErrors: boolean;
    onFinish: () => void;
}

const StatusIndicator = ({ color, label, count }: { color: string, label: string, count: number }) => (
    <Stack direction="row" spacing={0.5} alignItems="center">
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
        <Typography variant="caption" sx={{ fontWeight: 500, color: '#667085' }}>
            {count} {label}
        </Typography>
    </Stack>
);

export const Header: React.FC<HeaderProps> = ({ header, context, status, canFinish, onFinish  }) => {

    return (
        <Box sx={{ mb: 4 }}>

            <Stack direction="row" spacing={3} justifyContent="flex-end" sx={{ mb: 2 }}>
                <StatusIndicator color="#12b76a" label="Completed" count={8} />
                <StatusIndicator color="#2e90fa" label="In Progress" count={0} />
                <StatusIndicator color="#f79009" label="Rework" count={0} />
                <StatusIndicator color="#667085" label="Pending" count={0} />
            </Stack>

            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    {/* ... Titles ... */}
                    <Box sx={{
                        textAlign: 'Left'
                    }}>
                <Button
                        variant="contained"
                        onClick={onFinish}
                        disabled={status === 'approved' || !canFinish}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Finish update
                    </Button>
                    {!canFinish && (
                        // <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#d92d20' }}>
                        //     Required Fields are empty.Please fill all required fields to finish the stage.
                        // </Typography>
                        <></>
                    )}
                    </Box>
                </Stack>
                
            </Box>


            <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#667085', fontWeight: 600, letterSpacing: 0.5 }}>
                    {context.product.toUpperCase()} • WORK ORDER {context.workOrderId}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: '#101828' }}>
                    {header.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475467', mt: 1 }}>
                    {header.description}
                </Typography>
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#eaecf0' }} />


            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: '#f2f4f7', borderRadius: 1.5, display: 'flex' }}>
                            <PersonIcon sx={{ fontSize: 20, color: '#475467' }} />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#667085', display: 'block' }}>Operator</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#101828' }}>{header.operator.value}</Typography>
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: '#f2f4f7', borderRadius: 1.5, display: 'flex' }}>
                            <QueryBuilderIcon sx={{ fontSize: 20, color: '#475467' }} />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#667085', display: 'block' }}>Started At</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#101828' }}>
                                {new Date(header.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: '#f2f4f7', borderRadius: 1.5, display: 'flex' }}>
                            <AssignmentIcon sx={{ fontSize: 20, color: '#475467' }} />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#667085', display: 'block' }}>Stage Progress</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#101828' }}>
                                {context.stageNumber} of {context.totalStages} Stages
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
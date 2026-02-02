import React, { useState } from 'react';
import { Container, Box, CssBaseline } from '@mui/material';
import { stageExecutionData } from './data/stageData';
import { Header } from './components/Header';
import { SectionMapper } from './components/SectionMapper';
import { ApprovalBanner } from "./components/sections/ApprovalBanner";
import type { ChecklistItem, EvidenceItem } from './types/stageTypes';

const StageForm: React.FC = () => {
    const [formData, setFormdata] = useState(stageExecutionData);

   
    const handleUpdate = (sectionId: string, itemId: string, key: string, newValue: unknown) => {
        setFormdata((prevData) => ({
            ...prevData,
            sections: prevData.sections.map((section) => {
                if (section.id !== sectionId) return section;

                if (section.type === 'textarea') {
                    if (key === 'value' && typeof newValue === 'string') {
                        return { ...section, value: newValue };
                    }
                    return section;
                }

                if (section.type === 'checklist') {
                    return {
                        ...section,
                        items: section.items.map((item) => {
                            if (item.id !== itemId) return item;
                            return updateChecklistItem(item, key, newValue);
                        }),
                    };
                }

                if (section.type === 'requirements') {
                    return {
                        ...section,
                        items: section.items.map((item) => {
                            if (item.id !== itemId) return item;
                            if (key === 'status' && typeof newValue === 'string') {
                                return { ...item, status: newValue };
                            }
                            return item;
                        }),
                    };
                }

                return section;
            }),
        }));
    };

    const updateChecklistItem = (item: ChecklistItem, key: string, newValue: unknown) => {
        const response = item.response || { status: 'PENDING', comment: '', completedAt: '' };

        if (key === 'status' && typeof newValue === 'string') {
            return {
                ...item,
                response: {
                    ...response,
                    status: newValue,
                    completedAt: newValue === 'COMPLETED' ? new Date().toISOString() : ''
                }
            };
        }

        if (key === 'comment' && typeof newValue === 'string') {
            return {
                ...item,
                response: {
                    ...response,
                    comment: newValue
                }
            };
        }

        return item;
    };
    const isFormValid = formData.sections.every((section) => {
        if (section.type === 'checklist') {
            return section.items.every((item) => {
                if (!item.required) return true;
                const hasCompleted = item.response?.status === 'COMPLETED';
                const hasEvidence = (item.evidence || []).length > 0;
                return hasCompleted && hasEvidence;
            });
        }

        if (section.type === 'requirements') {
            return section.items.every((item) => !item.required || item.status === 'COMPLETED');
        }

        return true;
    });

    const handleFinish = () => {
        if (!isFormValid) return;
    setFormdata((prev) => ({
        ...prev,
        status: "approved", 
        locked: true, 
        audit: {
            ...prev.audit,
            approvedAt: new Date().toISOString() 
        }
    }));
};

  
    const handleAddEvidence = (sectionId: string, itemId: string ,file :File) => {
        const newEvidence: EvidenceItem = {
            fileName: file.name,
            fileSizeKB: Math.max (1, Math.round(file.size / 1024)),
            uploadedAt: new Date().toISOString(),
            url: URL.createObjectURL(file)
        };

        setFormdata((prevData) => ({
            ...prevData,
            sections: prevData.sections.map((section) => {
                if (section.id !== sectionId) return section;
                if (section.type !== 'checklist') return section;

                return {
                    ...section,
                    items: section.items.map((item) => {
                        if (item.id !== itemId) return item;
                        return {
                            ...item,
                            evidence: [...(item.evidence || []), newEvidence]
                        };
                    })
                };
            })
        }));
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="md">
                <Box sx={{
                    py: 4,
                    height: '100vh',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { width: '8px' }, 
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#d0d5dd', borderRadius: '4px' }
                }}>
                    {/* Header: Global information aur status */}
                    <Header
                        header={formData.header}
                        context={formData.context}
                        status={formData.status}
                        canFinish={isFormValid}
                        onFinish={handleFinish} 
                        // showErrors={!isFormValid}
                    />

            
                    <Box sx={{ mt: 2 }}>
                        {formData.sections.map((section) => (
                            <SectionMapper
                                key={section.id}
                                section={section}
                                locked={formData.locked}
                                onUpdate={handleUpdate}
                                onAddEvidence={handleAddEvidence} 
                            />
                        ))}
                    </Box>

                    
                    <ApprovalBanner status={formData.status} audit={formData.audit} />
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default StageForm;
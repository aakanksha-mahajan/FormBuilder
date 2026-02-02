import React, { useState } from 'react';
import { Container, Box, CssBaseline } from '@mui/material';
import { stageExecutionData } from './data/stageData';
import { Header } from './components/Header';
import { SectionMapper } from './components/SectionMapper';
import { ApprovalBanner } from "./components/sections/ApprovalBanner";

const StageForm: React.FC = () => {
    const [formData, setFormdata] = useState(stageExecutionData);

   
    const handleUpdate = (sectionId: string, itemId: string, key: string, newValue: any) => {
        setFormdata((prevData) => ({
            ...prevData,
            sections: prevData.sections.map((section) => {
                if (section.id !== sectionId) return section;

               
                if (section.type === 'textarea') {
                    return { ...section, value: newValue }; 
                }

                return {
                    ...section,
                    items: section.items.map((item: any) => {
                        if (item.id !== itemId) return item;

                       
                        if (section.type === 'checklist') {
                            return {
                                ...item,
                                response: {
                                    ...(item.response || { status: 'PENDING', comment: '' }),
                                    [key]: newValue,
                                    // Status COMPLETED hote hi auto-timestamp
                                    completedAt: key === 'status' && newValue === 'COMPLETED'
                                        ? new Date().toISOString()
                                        : item.response?.completedAt
                                }
                            };
                        }

                       
                        return { ...item, [key]: newValue };
                    }),
                };
            }),
        }));
    };

   // StageForm.tsx mein ye variable banayein
const isFormValid = formData.sections.every(section => {
  if (section.type === 'checklist') {
    return section.items.every(item => !item.required || item.response?.status === 'COMPLETED');
  }
 
  if (section.id === 'requirements') {
    return section.items.every(item => !item.required || item.status === 'COMPLETED');
  }
  return true;
});
    const handleFinish = () => {
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

  
    const handleAddEvidence = (sectionId: string, itemId: string) => {
        const newFile = {
            fileName: `Evidence-${Math.floor(Math.random() * 1000)}.jpg`,
            fileSizeKB: 450,
            uploadedAt: new Date().toISOString()
        };

        setFormdata((prevData) => ({
            ...prevData,
            sections: prevData.sections.map((section) => {
                if (section.id !== sectionId) return section;

                               if (section.type === 'textarea') return section;

                return {
                    ...section,
                    items: section.items.map((item: any) => {
                        if (item.id !== itemId) return item;
                        return {
                            ...item,
                            evidence: [...(item.evidence || []), newFile] 
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
                        onFinish={handleFinish} 
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
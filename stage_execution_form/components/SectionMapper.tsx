import React from 'react';
import type { FormSection } from '../types/stageTypes';
import { Box, Typography } from '@mui/material';
import { DocumentSectionUI } from './sections/DocumentSectionUI';
import { ChecklistSectionUI } from './sections/ChecklistSectionUI';
import { NotesSectionUI } from './sections/NotesSectionUI';
import { RequirementsSectionUI } from './sections/RequirementsSectionUI';

interface SectionMapperProps {
  section: FormSection;
  locked: boolean;
  onUpdate: (sectionId: string, itemId: string, key: string, newValue: any) => void;
  onAddEvidence: (sectionId: string, itemId: string) => void;
}

export const SectionMapper: React.FC<SectionMapperProps> = ({ section, locked, onUpdate ,onAddEvidence}) => {
  switch (section.type) {
    case "document_group":
      // Now using the real UI component instead of <div>
      return <DocumentSectionUI data={section}/>;

    case "checklist":
      // Now using the real UI component instead of <div>
      return <ChecklistSectionUI data={section} locked={locked} onUpdate={onUpdate} onAddEvidence={onAddEvidence} />;

    case "requirements":
  return <RequirementsSectionUI data={section} onUpdate={onUpdate} />;

  case "textarea":
      return <NotesSectionUI data={section} onUpdate={onUpdate} locked={locked} />;

    default:
      return <div>Unsupported Section Type</div>;
  }
};
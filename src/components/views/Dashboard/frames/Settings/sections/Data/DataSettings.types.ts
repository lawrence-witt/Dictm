import { SectionClasses } from '../../../../../../molecules/Section/Section.types';

export interface DataSettingsProps {
    baseClasses: SectionClasses;
    deleteResourcesClasses: SectionClasses;
    deleteUserClasses: SectionClasses;
    userId: string;
}

export type DataTypes = "recordings" | "notes" | "categories" | "user";

export interface DataSettingsDialogState {
    open: boolean;
    type: DataTypes;
}

export interface DataSettingsDialogProps extends DataSettingsDialogState {
    userId: string;
    closeModal: () => void
}
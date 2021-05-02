import { SectionClasses } from '../../../../../../molecules/Section/Section.types';

export interface DataSettingsProps {
    baseClasses: SectionClasses;
    deleteResourcesClasses: SectionClasses;
    deleteUserClasses: SectionClasses;
}

export type DataTypes = "recordings" | "notes" | "categories" | "user";

export interface DataSettingsModalState {
    open: boolean;
    type: DataTypes;
}

export interface DataSettingsModalProps extends DataSettingsModalState {
    closeModal: () => void
}
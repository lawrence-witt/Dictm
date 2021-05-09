import { SectionClasses } from '../../../../../molecules/Section/Section.types';
import { ByteUnitKeys } from '../../../../../../db/models/User';

export interface StorageSettingsProps {
    baseClasses: SectionClasses;
    persistenceClasses: SectionClasses;
    thresholdClasses: SectionClasses;
    thresholdValue: number;
    thresholdUnit: ByteUnitKeys;
}

interface ByteOption<B extends ByteUnitKeys> {
    id: B;
    title: B;
}

type ByteOptions = ByteOption<ByteUnitKeys>[];

export { ByteUnitKeys };

export const byteOptions: ByteOptions = [
    {id: "Bytes", title: "Bytes"},
    {id: "KB", title: "KB"},
    {id: "MB", title: "MB"},
    {id: "GB", title: "GB"}
];
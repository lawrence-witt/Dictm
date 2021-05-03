import { SectionClasses } from '../../../../../../molecules/Section/Section.types';
import { SortOrderKeys } from '../../../../../../../db/models/User';

export interface DisplaySettingsProps {
    baseClasses: SectionClasses;
    sortClasses: SectionClasses;
    sortOrders: {
        recordings: SortOrderKeys;
        notes: SortOrderKeys;
        categories: SortOrderKeys;
        mixed: SortOrderKeys;
    }
}

interface OrderOption<O extends SortOrderKeys> {
    id: O;
    title: string;
}

type OrderOptions = OrderOption<SortOrderKeys>[];

export { SortOrderKeys };

export const orderOptions: OrderOptions = [
    {id: "createdAsc", title: "Created date (oldest first)"},
    {id: "createdDesc", title: "Created date (newest first)"},
    {id: "modifiedAsc", title: "Last Modified date (oldest first)"},
    {id: "modifiedDesc", title: "Last Modified date (newest first)"},
    {id: "alphaAsc", title: "Alphabetically (A > Z)"},
    {id: "alphaDesc", title: "Alphabetically (Z > A)"}
];

export type ViewKeys = keyof DisplaySettingsProps["sortOrders"];
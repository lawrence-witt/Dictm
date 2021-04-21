export type MinMax = number | '1fr';
export type RepeatType = 'auto-fill' | 'auto-fit';

export interface MasonryGridProps {
    repeat?: RepeatType;
    min?: number;
    max?: MinMax;
    gridClass?: string;
    columnClass?: string;
}

export interface MasonryGridState {
    width?: number;
    columns: unknown[][];
    minWidth?: number;
    maxWidth?: string | number;
}
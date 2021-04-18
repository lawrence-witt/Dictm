export interface DetailProps {
    name: string;
    value: string;
}

export interface DetailDialogProps {
    details: DetailProps[];
    onClose: () => unknown;
}
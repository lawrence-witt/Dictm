export interface NotifierMessageProps {
    message: string[],
    dismiss?(): void;
}
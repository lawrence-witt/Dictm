export type PanelTypes = 'cat' | 'choose' | 'note' | 'rec';

export type EditorContentClasses = 
    'categoryEditorContent' | 
    'noteEditorContent' |
    'recordingEditorContent'
;

export interface EditorPanel {
    type: PanelTypes;
    title: string;
    disableGutters: boolean;
    component: string;
    className?: EditorContentClasses;
    Buttons?: React.FC<any>,
    Content: React.FC<any>
}
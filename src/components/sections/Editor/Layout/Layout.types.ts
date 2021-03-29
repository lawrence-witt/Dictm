import {
    EditorContexts
} from '../../../../redux/ducks/editor';

export interface EditorLayoutProps {
    context: EditorContexts[keyof EditorContexts];
}

type EditorPanelClasses = 
    'categoryEditorPanel' | 
    'noteEditorPanel' |
    'recordingEditorPanel'
;

export interface EditorPanel {
    disableGutters: boolean;
    as: string;
    className?: EditorPanelClasses;
    buttons: JSX.Element | null;
    component: JSX.Element;
}
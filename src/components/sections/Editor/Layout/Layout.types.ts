import {
    EditorModels
} from '../../../../redux/ducks/editor';

export interface EditorLayoutProps {
    title: string;
    model: EditorModels;
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
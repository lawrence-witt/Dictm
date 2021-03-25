import {
    EditorContexts
} from '../../../../redux/ducks/editor';
import { EditorState } from '../../../../redux/ducks/editor/types';

export interface EditorLayoutProps {
    attributes: EditorState["attributes"];
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
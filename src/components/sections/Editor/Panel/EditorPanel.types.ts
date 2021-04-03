import { EditorContexts, EditorModelTypes } from '../../../../redux/ducks/editor';

export interface EditorPanelProps {
    context: EditorContexts[keyof EditorContexts];
}

export interface EditorPanelSwitchProps extends EditorPanelProps {
    displayType: EditorModelTypes;
}
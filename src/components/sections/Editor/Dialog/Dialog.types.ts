import { EditorState, EditorContexts } from '../../../../redux/ducks/editor'

export interface DialogProps {
    attributes: EditorState["attributes"];
    context: EditorContexts[keyof EditorContexts];
    dialogs: EditorState["dialogs"];
}
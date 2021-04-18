import { EditorContexts } from '../../../../../redux/ducks/editor';

export interface NotePanelProps {
    model: EditorContexts["note"]["data"]["editing"];
}
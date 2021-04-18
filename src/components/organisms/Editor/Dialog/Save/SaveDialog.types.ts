import { EditorModelTypes } from '../../../../../redux/ducks/editor';

export interface SaveDialogProps {
    type: EditorModelTypes | undefined;
    isNew: boolean;
}
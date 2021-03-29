import { EditorModelTypes } from '../../../../../redux/ducks/editor';

export interface SaveDialogProps {
    contentType: EditorModelTypes;
    isNew: boolean;
}
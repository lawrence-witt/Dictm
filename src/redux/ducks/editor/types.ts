import { RecordingModel } from '../../_data/recordingsData';
import { NoteModel } from '../../_data/notesData';
import { CategoryModel } from '../../_data/categoriesData';

export const EDITOR_OPENED = "dictm/editor/EDITOR_OPENED";
export const EDITOR_CLOSED = "dictm/editor/EDITOR_CLOSED";

export type EditorType = 'choose' | 'recording' | 'note' | 'category';
export type ContentModels = RecordingModel | NoteModel | CategoryModel;

export interface EditorState {
    editorType?: EditorType;
    contentId?: string;
    contentModel?: ContentModels;
}

export interface EditorOpenedAction {
    type: typeof EDITOR_OPENED;
    payload: {
        editorType: EditorType;
        contentId?: string;
        contentModel?: ContentModels;
    }
}

export interface EditorClosedAction {
    type: typeof EDITOR_CLOSED;
}

export type EditorActionTypes = 
    EditorOpenedAction |
    EditorClosedAction;
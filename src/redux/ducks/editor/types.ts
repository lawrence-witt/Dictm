import { RecordingModel } from '../../_data/recordingsData';
import { NoteModel } from '../../_data/notesData';
import { CategoryModel } from '../../_data/categoriesData';

export const EDITOR_OPENED = "dictm/editor/EDITOR_OPENED";
export const EDITOR_CLOSED = "dictm/editor/EDITOR_CLOSED";

export type ContentModelTypes = 'recording' | 'note' | 'category';
export type ContentModels = RecordingModel | NoteModel | CategoryModel;

export type EditorModelTypes = "choose" | ContentModelTypes;
export type EditorModels = {id: "new", contentType: "choose"} | ContentModels;

/* 
*   Reducer Types
*/

export interface EditorState {
    editorTitle: string;
    contentModel?: EditorModels;
}

export interface EditorOpenedAction {
    type: typeof EDITOR_OPENED;
    payload: {
        editorTitle: string;
        contentModel?: EditorModels;
    }
}

export interface EditorClosedAction {
    type: typeof EDITOR_CLOSED;
}

export type EditorActionTypes = 
    EditorOpenedAction |
    EditorClosedAction;
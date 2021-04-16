import Note from '../../../../db/models/Note';
import { EditorContext, EditorOpenedAction } from '../types';

export const NOTE_EDITOR_TITLE_UPDATED          = "dictm/editor/note/NOTE_TITLE_UPDATED";
export const NOTE_EDITOR_CATEGORY_UPDATED       = "dictm/editor/note/NOTE_CATEGORY_UPDATED";
export const NOTE_EDITOR_DATA_UPDATED           = "dictm/editor/note/NOTE_DATA_UPDATED";

export type NoteEditorContext = EditorContext<Note>;

export interface NoteEditorTitleUpdatedAction {
    type: typeof NOTE_EDITOR_TITLE_UPDATED;
    payload: {
        title: string;
    }
}

export interface NoteEditorCategoryUpdatedAction {
    type: typeof NOTE_EDITOR_CATEGORY_UPDATED;
    payload: {
        id?: string;
    }
}

export interface NoteEditorDataUpdatedAction {
    type: typeof NOTE_EDITOR_DATA_UPDATED;
    payload: {
        data: Note["data"];
    }
}

export type NoteEditorActionTypes =
    EditorOpenedAction |
    NoteEditorTitleUpdatedAction |
    NoteEditorCategoryUpdatedAction |
    NoteEditorDataUpdatedAction;
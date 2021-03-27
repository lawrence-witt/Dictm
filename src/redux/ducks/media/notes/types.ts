import { NoteModel } from '../../../_data/notesData';

export const NOTE_CREATED           = "dictm/media/notes/NOTE_CREATED";
export const NOTE_OVERWRITTEN       = "dictm/media/notes/NOTE_OVERWRITTEN";
export const NOTE_CATEGORY_UPDATED  = "dictm/media/notes/NOTE_CATEGORY_UPDATED";
export const NOTE_DELETED           = "dictm/media/notes/NOTE_DELETED";

export interface NotesState {
    byId: Record<string, NoteModel>;
    allIds: string[];
}

export interface NoteCreatedAction {
    type: typeof NOTE_CREATED;
    payload: {
        note: NoteModel;
    }
}

export interface NoteOverwrittenAction {
    type: typeof NOTE_OVERWRITTEN;
    payload: {
        note: NoteModel;
    }
}

export interface NoteCategoryUpdatedAction {
    type: typeof NOTE_CATEGORY_UPDATED;
    payload: {
        id: string;
        categoryId: string | undefined;
    }
}

export interface NoteDeletedAction {
    type: typeof NOTE_DELETED;
    payload: {
        id: string;
    }
}

export type NotesActionTypes = 
    NoteCreatedAction |
    NoteOverwrittenAction |
    NoteCategoryUpdatedAction |
    NoteDeletedAction;
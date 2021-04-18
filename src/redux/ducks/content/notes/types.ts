import Note from '../../../../db/models/Note';

export const NOTES_LOADED       = "dictm/content/notes/NOTES_LOADED";
export const NOTE_CREATED       = "dictm/content/notes/NOTE_CREATED";
export const NOTES_OVERWRITTEN  = "dictm/content/notes/NOTES_OVERWRITTEN";
export const NOTES_DELETED      = "dictm/content/notes/NOTES_DELETED";
export const NOTES_CLEARED      = "dictm/content/notes/NOTES_CLEARED";

export interface NotesState {
    byId: Record<string, Note>;
    allIds: string[];
}

export interface NotesLoadedAction {
    type: typeof NOTES_LOADED;
    payload: {
        notes: Note[];
    }
}

export interface NoteCreatedAction {
    type: typeof NOTE_CREATED;
    payload: {
        note: Note;
    }
}

export interface NotesOverwrittenAction {
    type: typeof NOTES_OVERWRITTEN;
    payload: {
        notes: Note[];
    }
}

export interface NotesDeletedAction {
    type: typeof NOTES_DELETED;
    payload: {
        ids: string[];
    }
}

export interface NotesClearedAction {
    type: typeof NOTES_CLEARED;
}

export type NotesActionTypes = 
|   NotesLoadedAction
|   NoteCreatedAction
|   NotesOverwrittenAction
|   NotesDeletedAction
|   NotesClearedAction;
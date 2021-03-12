import { NoteModel } from '../../../_data/notesData';

export const NOTE_ADDED = "dictm/notes/NOTE_ADDED";

export interface NotesState {
    byId: Record<string, NoteModel>;
    allIds: string[];
}

interface NoteAddedAction {
    type: typeof NOTE_ADDED;
    payload: {
        note: NoteModel;
    }
}

export type NotesActionTypes = NoteAddedAction;
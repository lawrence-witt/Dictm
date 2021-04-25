import {
    selectNote,
    selectNotesById,
    selectNotesByUserId,
    insertNote,
    updateNote,
    deleteNote,
    deleteNotes,
    _insertNote,
    _updateNote,
    _deleteNote,
    _deleteNotes
} from './NoteController';

export default {
    selectNote,
    selectNotesById,
    selectNotesByUserId,
    insertNote,
    updateNote,
    deleteNote,
    deleteNotes
}

export const _NoteController = {
    _insertNote,
    _updateNote,
    _deleteNote,
    _deleteNotes
}
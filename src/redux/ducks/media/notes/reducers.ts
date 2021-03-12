import {
    NotesState,
    NotesActionTypes,
    NOTE_ADDED
} from './types';

import mockNotesData from '../../../_data/notesData';

const initialState: NotesState = mockNotesData.reduce((state: NotesState, note) => {
    state.byId[note.id] = note;
    state.allIds.push(note.id);
    return state;
}, {byId: {}, allIds: []});

const notesReducer = (
    state = initialState, 
    action: NotesActionTypes
): NotesState => {
    switch(action.type) {
        case NOTE_ADDED:
            const { note } = action.payload;

            return {
                byId: {
                    ...state.byId,
                    [note.id]: note
                },
                allIds: [note.id, ...state.allIds]
            }
        default:
            return state;
    }
}

export default notesReducer;
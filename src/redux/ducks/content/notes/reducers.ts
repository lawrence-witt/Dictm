import * as types from './types';

const initialState: types.NotesState = {
    byId: {},
    allIds: []
}

const notesReducer = (
    state = initialState, 
    action: types.NotesActionTypes
): types.NotesState => {
    switch(action.type) {
        case types.NOTES_LOADED:
            return action.payload.notes.reduce((out: types.NotesState, note) => {
                out.byId[note.id] = note;
                out.allIds = [...out.allIds, note.id];
                return out;
            }, {byId: {}, allIds: []})
        case types.NOTE_CREATED: {
            const { note } = action.payload;

            return {
                byId: {
                    ...state.byId,
                    [note.id]: note
                },
                allIds: [note.id, ...state.allIds]
            }
        }
        case types.NOTES_OVERWRITTEN: {
            const { notes } = action.payload;
            const clonedState = {...state, byId: { ...state.byId }};

            return notes.reduce((out, note) => {
                out.byId[note.id] = note;
                return out;
            }, clonedState);
        }
        case types.NOTES_DELETED: {
            const { ids } = action.payload;

            const clonedState = {
                byId: {...state.byId}, 
                allIds: [...state.allIds]
            };

            ids.forEach(id => delete clonedState.byId[id]);
            clonedState.allIds = clonedState.allIds.filter(id => !ids.includes(id));

            return clonedState;
        }
        case types.NOTES_CLEARED:
            return initialState;
        default:
            return state;
    }
}

export default notesReducer;
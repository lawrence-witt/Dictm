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
        case types.NOTE_OVERWRITTEN: {
            const { note } = action.payload;

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [note.id]: note
                }
            }
        }
        case types.NOTE_CATEGORY_UPDATED: {
            const { id, categoryId } = action.payload;

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [id]: {
                        ...state.byId[id],
                        relationships: {
                            ...state.byId[id].relationships,
                            category: {
                                id: categoryId
                            }
                        }
                    }
                }
            }
        }
        case types.NOTE_DELETED: {
            const { id } = action.payload;

            const clone = {...state};

            delete clone.byId[id];
            clone.allIds = clone.allIds.filter(i => i !== id);

            return clone;
        }
        default:
            return state;
    }
}

export default notesReducer;
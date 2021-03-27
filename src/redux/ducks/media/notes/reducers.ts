import * as types from './types';

import mockNotesData from '../../../_data/notesData';

const initialState: types.NotesState = mockNotesData.reduce((state: types.NotesState, note) => {
    state.byId[note.id] = note;
    state.allIds.push(note.id);
    return state;
}, {byId: {}, allIds: []});

const notesReducer = (
    state = initialState, 
    action: types.NotesActionTypes
): types.NotesState => {
    switch(action.type) {
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
                            category: categoryId ? { id: categoryId } : undefined
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
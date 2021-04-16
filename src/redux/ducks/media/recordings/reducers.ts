import * as types from './types';

const initialState: types.RecordingsState = {
    byId: {},
    allIds: []
}

const recordingsReducer = (
    state = initialState, 
    action: types.RecordingsActionTypes
): types.RecordingsState => {
    switch(action.type) {
        case types.RECORDINGS_LOADED:
            return action.payload.recordings.reduce((out: types.RecordingsState, recording) => {
                out.byId[recording.id] = recording;
                out.allIds = [...out.allIds, recording.id];
                return out;
            }, {byId: {}, allIds: []});
        case types.RECORDING_CREATED:
            const { recording } = action.payload;

            return {
                byId: {
                    ...state.byId,
                    [recording.id]: recording
                },
                allIds: [recording.id, ...state.allIds]
            }
        case types.RECORDING_OVERWRITTEN: {
            const { recording } = action.payload;

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [recording.id]: recording
                }
            }
        }
        case types.RECORDING_CATEGORY_UPDATED: {
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
        case types.RECORDING_DELETED: {
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

export default recordingsReducer;
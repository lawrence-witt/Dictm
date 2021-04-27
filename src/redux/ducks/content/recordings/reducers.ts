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
        case types.RECORDINGS_OVERWRITTEN: {
            const { recordings } = action.payload;
            const clonedState = {...state, byId: { ...state.byId }};

            return recordings.reduce((out, recording) => {
                out.byId[recording.id] = recording;
                return out;
            }, clonedState);
        }
        case types.RECORDINGS_DELETED: {
            const { ids } = action.payload;

            return {
                byId: (bi => {
                    ids.forEach(id => delete bi[id]); 
                    return bi;
                })({...state.byId}),
                allIds: state.allIds.filter(id => !ids.includes(id))
            }
        }
        case types.RECORDINGS_CLEARED:
            return initialState;
        default:
            return state;
    }
}

export default recordingsReducer;
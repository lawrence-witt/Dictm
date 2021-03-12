import {
    RecordingsState,
    RecordingsActionTypes,
    RECORDING_ADDED
} from './types';

import mockRecordingsData from '../../../_data/recordingsData';

const initialState: RecordingsState = mockRecordingsData.reduce((state: RecordingsState, rec) => {
    state.byId[rec.id] = rec;
    state.allIds.push(rec.id);
    return state;
}, {byId: {}, allIds: []});

const recordingsReducer = (
    state = initialState, 
    action: RecordingsActionTypes
): RecordingsState => {
    switch(action.type) {
        case RECORDING_ADDED:
            const { recording } = action.payload;

            return {
                byId: {
                    ...state.byId,
                    [recording.id]: recording
                },
                allIds: [recording.id, ...state.allIds]
            }
        default:
            return state;
    }
}

export default recordingsReducer;
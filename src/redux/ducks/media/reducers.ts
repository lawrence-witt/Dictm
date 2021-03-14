import { combineReducers } from 'redux';

import recordingsReducer from './recordings';
import notesReducer from './notes';

const mediaReducer = combineReducers({
    recordings: recordingsReducer,
    notes: notesReducer
});

export default mediaReducer;
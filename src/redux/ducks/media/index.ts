import { combineReducers } from 'redux';

import recordingsReducer from './recordings';
import notesReducer from './notes';

import * as mediaSelectors from './selectors';

const mediaReducer = combineReducers({
    recordings: recordingsReducer,
    notes: notesReducer
});

export { mediaSelectors };
export default mediaReducer;
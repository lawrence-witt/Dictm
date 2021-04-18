import { combineReducers } from 'redux';

import recordingsReducer from './recordings';
import notesReducer from './notes';
import categoriesReducer from './categories';

const mediaReducer = combineReducers({
    recordings: recordingsReducer,
    notes: notesReducer,
    categories: categoriesReducer
});

export default mediaReducer;
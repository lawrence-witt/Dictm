import { createStore, applyMiddleware, combineReducers, Action } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import * as reducers from './ducks';
import * as types from './store.types';

const initialState = {};
const rootReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof rootReducer>;

export type ThunkResult<R> = ThunkAction<R, RootState, null, Action>;

const options: types.CorrectEnhancerOptions = {
    serialize: {
        undefined: true,
        replacer: (_, value) => {
            if (!types.isTypedArray(value)) return value;

            const { length, byteLength } = value;

            return JSON.stringify({
                bytes: (() => {
                    if (value.length <= 10) return Array.from(value.slice(0));
                    return [
                        ...Array.from(value.slice(0, 5)), 
                        "...", 
                        ...Array.from(value.slice(value.length - 5))
                    ];
                })(),
                length,
                byteLength
            });
        }
    }
}

const composeEnhancers = composeWithDevTools(options);

const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(thunkMiddleware)
));

export default store;
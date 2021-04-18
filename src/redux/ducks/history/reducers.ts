import * as types from './types';

const initialState: types.HistoryState = {
    previous: undefined,
    current: {
        pathname: window.location.pathname,
        search: "",
        hash: "",
        state: undefined
    }
}

const historyReducer = (
    state = initialState,
    action: types.HistoryActionTypes
): types.HistoryState => {
    switch (action.type) {
        case types.LOCATION_CHANGED:
            return {
                previous: state.current,
                current: action.payload.location
            }
        default: return state;
    }
}

export default historyReducer;
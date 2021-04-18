import { Location } from 'history';

import * as types from './types';

export const changeLocation = (
    location: Location
): types.LocationChangedAction => ({
    type: types.LOCATION_CHANGED,
    payload: {
        location
    }
});
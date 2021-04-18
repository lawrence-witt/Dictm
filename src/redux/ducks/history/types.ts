import { Location } from 'history';

export const LOCATION_CHANGED = "dictm/history/LOCATION_CHANGED";

export interface HistoryState {
    previous?: Location;
    current: Location;
}

export interface LocationChangedAction {
    type: typeof LOCATION_CHANGED;
    payload: {
        location: Location;
    };
}

export type HistoryActionTypes = LocationChangedAction;
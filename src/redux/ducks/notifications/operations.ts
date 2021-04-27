import { ThunkResult } from '../../store';

import * as actions from './actions';
import * as types from './types';
import * as helpers from './helpers';

type V = types.VariantType;
type A = types.NotificationActions;

export function addNotification(p: false, v: V, m: string[], a?: A): ThunkResult<void>;
export function addNotification(p: true, v: V, m: string[], a: A): ThunkResult<void>;
export function addNotification(persist: boolean, variant: V, message: string[], action?: A): ThunkResult<void> {
    return (dispatch) => {
        const notification = helpers.generateNotification(persist, variant, message, action);
        dispatch(actions.addNotification(notification));
    }
}

export const notifyDatabaseError = (message: string): ThunkResult<void> => (
    dispatch
) => {
    const header = `A critical error has occured: ${message}`;
    const sub = "Reload the application to repair the database.";

    dispatch(addNotification(true, "error", [header, sub], "RELOAD"));
}

export const notifyRecordingError = (type: 'insert' | 'connect', message: string): ThunkResult<void> => (
    dispatch
) => {
    if (type === "insert") {
        dispatch(addNotification(false, "error", ["Recording could not be inserted:", message]));
    } else {
        const connectMessage = "Could not connect to a microphone. Please check your microphone permissions and try again.";
        dispatch(addNotification(false, "error", [connectMessage]));
    }
}

export const dismissNotification = (
    key: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.dismissNotification(key));
}

export const removeNotification = (
    key: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.removeNotification(key));
}
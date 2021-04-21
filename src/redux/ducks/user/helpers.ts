import User from '../../../db/models/User';
import { UserController } from '../../../db/controllers/User';

import * as types from './types';

/* 
*   Session storage helpers
*/

const isObject = (value: unknown): value is {[key in string | number]: any} => {
    if (!value || Object.getPrototypeOf(value) !== Object.prototype) return false;
    return true;
}

const isSession = (value: unknown): value is types.UserSession => {
    if (!isObject(value)) return false;
    if (!value.user || !value.user.id) return false;
    if (!value.timestamps || !value.timestamps.created || !value.timestamps.modified) return false;
    return true;
}

const createSession = (
    userId: string
): types.UserSession => ({
    user: {
        id: userId
    },
    timestamps: {
        created: Date.now(),
        modified: Date.now()
    }
});

const modifySession = (
    session: types.UserSession
): types.UserSession => ({
    ...session,
    timestamps: {
        ...session.timestamps,
        modified: Date.now()
    }
});

const getSession = (
    storage: Storage
): types.UserSession | null => {
    const record = (r => r ? JSON.parse(r) : r)(storage.getItem("session"));
    if (!isSession(record)) return null;
    return record;
}

const getUserSession = (
    userId: string,
    storage: Storage
): types.UserSession | null => {
    const record = getSession(storage);
    if (!record || record.user.id !== userId) return null;
    return record;
}

const setUserSession = (
    session: types.UserSession,
    storage: Storage
) => {
    storage.setItem("session", JSON.stringify(session));
}

const deleteSession = (
    storage: Storage
) => {
    storage.removeItem("session");
}

export const persistSession = (
    userId: string
): void => {
    const sessionRecord = getUserSession(userId, sessionStorage);
    const localRecord = getUserSession(userId, localStorage);

    if (sessionRecord) return;

    const updated = localRecord ? 
        modifySession(localRecord) : 
        createSession(userId);
    
    setUserSession(updated, sessionStorage);
    setUserSession(updated, localStorage);
}

export const retrieveSession = async (): Promise<User | undefined> => {
    const localRecord = getSession(localStorage);

    if (!localRecord) return;

    return await (async () => {
        try {
            return await UserController.selectUser(localRecord.user.id);
        } catch {
            clearSession();
        }
    })();
}

export const clearSession = (): void => {
    deleteSession(sessionStorage);
    deleteSession(localStorage);
}
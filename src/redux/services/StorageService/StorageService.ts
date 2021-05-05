import * as types from './StorageService.types';

class StorageService {

    // Type guards

    private _isObject(value: unknown): value is {[key in string | number | symbol]: any} {
        return Boolean(value && Object.getPrototypeOf(value) === Object.prototype);
    }

    private _isNumber(value: unknown): value is number {
        return typeof value === "number";
    }

    private _isSession(value: unknown): value is types.UserSession {
        if (!this._isObject(value)) return false;
        if (!value.user || !value.user.id) return false;
        if (!value.flags || !value.flags.hasOwnProperty("hasError")) return false;
        if (!value.timestamps || !this._isNumber(value.timestamps.previous) || !this._isNumber(value.timestamps.current)) return false;
        return true;
    }

    // Private utility methods

    private _createSession(userId: string) {
        return {
            user: {
                id: userId
            },
            flags: {
                hasError: false
            },
            timestamps: {
                previous: Date.now(),
                current: Date.now()
            }
        }
    }

    private _incrementSession(session: types.UserSession) {
        return {
            ...session,
            timestamps: {
                previous: session.timestamps.current,
                current: Date.now()
            }
        }
    }

    private _getSession() {
        const record = (r => r ? JSON.parse(r) : r)(localStorage.getItem("session"));
        if (!this._isSession(record)) return null;
        return record;
    }

    private _getUserSession(userId: string) {
        const record = this._getSession();
        if (!record || record.user.id !== userId) return null;
        return record;
    }

    private _setSession(session: types.UserSession) {
        localStorage.setItem("session", JSON.stringify(session));
    }

    // Public methods

    public persistSession(userId: string): types.UserSession {
        const sessionRecord = this._getUserSession(userId);

        if (sessionRecord) return sessionRecord;

        const created = this._createSession(userId);
        this._setSession(created);

        return created;
    }

    public retrieveSession(): types.UserSession | null {
        const sessionRecord = this._getSession();
        if (!sessionRecord) return null;

        const incremented = this._incrementSession(sessionRecord);
        this._setSession(incremented);

        return incremented;
    }

    public clearSession(): void {
        localStorage.removeItem("session");
    }

    public sessionOlderThan(ms: number, session: types.UserSession): boolean {
        return session.timestamps.current - session.timestamps.previous > ms;
    }

    public setSessionFlag(flag: keyof types.UserSession["flags"], value: boolean): types.UserSession | null {
        const sessionRecord = this._getSession();

        if (!sessionRecord) return null;

        sessionRecord.flags[flag] = value;
        this._setSession(sessionRecord);

        return sessionRecord;
    }
}

export default StorageService;
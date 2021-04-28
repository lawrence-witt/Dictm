import * as types from './StorageService.types';

class StorageService {
    // Type guards

    private _isObject(value: unknown): value is {[key in string | number | symbol]: any} {
        return Boolean(value && Object.getPrototypeOf(value) === Object.prototype);
    }

    private _isSession(value: unknown): value is types.UserSession {
        if (!this._isObject(value)) return false;
        if (!value.user || !value.user.id) return false;
        if (!value.flags || !value.flags.hasOwnProperty("hasError")) return false;
        return true;
    }

    // Utility methods

    private _createSession(userId: string) {
        return {
            user: {
                id: userId
            },
            flags: {
                hasError: false
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

    public persistSession(userId: string): void {
        const sessionRecord = this._getUserSession(userId);

        if (sessionRecord) return;

        this._setSession(this._createSession(userId));
    }

    public retrieveSession(): types.UserSession | null {
        return this._getSession();
    }

    public clearSession(): void {
        localStorage.removeItem("session");
    }

    public setSessionFlag(flag: keyof types.UserSession["flags"], value: boolean): void {
        const sessionRecord = this._getSession();

        if (!sessionRecord) return;

        sessionRecord.flags[flag] = value;

        this._setSession(sessionRecord);
    }
}

export default StorageService;
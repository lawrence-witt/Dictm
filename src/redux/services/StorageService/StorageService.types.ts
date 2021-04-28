export interface UserSession {
    user: {
        id: string;
    };
    flags: {
        hasError: boolean;
    };
}
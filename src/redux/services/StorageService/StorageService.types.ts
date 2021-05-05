export interface UserSession {
    user: {
        id: string;
    };
    flags: {
        hasError: boolean;
    };
    timestamps: {
        previous: number;
        current: number;
    }
}
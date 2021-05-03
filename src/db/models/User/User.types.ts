const sortOrders = ["createdDesc", "createdAsc", "modifiedDesc", "modifiedAsc", "alphaDesc", "alphaAsc"] as const;
const byteUnits = ["Bytes", "KB", "MB", "GB"] as const;

export type SortOrderKeys = typeof sortOrders[number];
export type ByteUnitKeys = typeof byteUnits[number];

export interface UserModel {
    id: string;
    type: "user";
    attributes: {
        name: string;
        timestamps: {
            created: number;
            modified: number;
        }
    };
    settings: {
        preferences: {
            greeting: string;
        };
        display: {
            sort: {
                recordings: SortOrderKeys;
                notes: SortOrderKeys;
                categories: SortOrderKeys;
                mixed: SortOrderKeys;
            }
        };
        storage: {
            persistence: {
                prompted: boolean;
            };
            threshold: {
                value: number;
                unit: ByteUnitKeys;
            };
        };
    }
}
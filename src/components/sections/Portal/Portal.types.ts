export type PanelTypes = "home" | "localUsers" | "newUser";

export interface PanelState {
    prev?: PanelTypes;
    current: PanelTypes;
}
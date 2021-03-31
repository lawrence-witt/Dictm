export const NAV_MENU_OPENED = "dictm/tools/nav/NAV_MENU_OPENED";
export const NAV_MENU_CLOSED = "dictm/tools/nav/NAV_MENU_CLOSED";

export interface NavMenuState {
    isOpen: boolean;
}

export interface NavMenuOpenedAction {
    type: typeof NAV_MENU_OPENED;
}

export interface NavMenuClosedAction {
    type: typeof NAV_MENU_CLOSED;
}

export type NavMenuActionTypes =
    NavMenuOpenedAction |
    NavMenuClosedAction;

export interface NavMenuItem {
    id: string;
    primary: string;
    icon?: string;
    divider?: boolean;
    to?: string;
    onClick?: () => void;
}

export interface NavMenuList {
    id: string;
    name: string;
    items: NavMenuItem[];
}

export type NavMenuLists = Record<string, NavMenuList>;
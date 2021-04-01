/* Nav Menu Types */

export const NAV_MENU_OPENED = "dictm/navigation/menu/MENU_OPENED";
export const NAV_MENU_CLOSED = "dictm/navigation/menu/MENU_CLOSED";

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

/* Nav History Types */

export const stems = ['recordings', 'notes', 'categories', 'settings'] as const;

export interface Params {
    stem: typeof stems[number] | undefined;
    categoryId: string | undefined;
}

interface NavHistoryRecord {
    pathname: string;
    title: string;
    params: Params;
}

export const NAV_LOCATION_CHANGED = "dictm/navigation/history/LOCATION_CHANGED";

export interface NavHistoryState {
    previous?: NavHistoryRecord;
    current: NavHistoryRecord;
}

export interface NavLocationChangedAction {
    type: typeof NAV_LOCATION_CHANGED;
    payload: NavHistoryRecord;
}

export type NavHistoryActionTypes =
    NavLocationChangedAction;
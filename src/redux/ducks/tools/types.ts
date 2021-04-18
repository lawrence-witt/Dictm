/* Nav Menu Types */

export const NAV_MENU_OPENED = "dictm/tools/nav/MENU_OPENED";
export const NAV_MENU_CLOSED = "dictm/tools/nav/MENU_CLOSED";

export const stems = ['recordings', 'notes', 'categories', 'settings'] as const;

export interface Params {
    stem: typeof stems[number] | undefined;
    categoryId: string | undefined;
}


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

/* Search Tool Types */

export const SEARCH_TOOL_OPENED = "dictm/tools/search/OPENED";
export const SEARCH_TERM_SET    = "dictm/tools/search/TERM_SET";
export const SEARCH_TOOL_CLOSED = "dictm/tools/search/CLOSED";

export interface SearchToolState {
    isOpen: boolean;
    term: string;
}

export interface SearchToolOpenedAction {
    type: typeof SEARCH_TOOL_OPENED;
}

export interface SearchTermSetAction {
    type: typeof SEARCH_TERM_SET;
    payload: {
        term: string;
    }
}

export interface SearchToolClosedAction {
    type: typeof SEARCH_TOOL_CLOSED;
}

export type SearchToolActionTypes =
    SearchToolOpenedAction |
    SearchTermSetAction |
    SearchToolClosedAction |
    DeleteToolOpenedAction;

/* Delete Tool Types */

export const DELETE_TOOL_OPENED             = "dictm/tools/delete/OPENED";
export const DELETE_TOOL_RESOURCE_TOGGLED   = "dictm/tools/delete/RESOURCE_TOGGLED";
export const DELETE_TOOL_SET_DELETING       = "dictm/tools/delete/SET_DELETING";
export const DELETE_TOOL_DELETED            = "dictm/tools/delete/DELETED";
export const DELETE_TOOL_CLOSED             = "dictm/tools/delete/CLOSED";

export interface DeleteToolState {
    isOpen: boolean;
    isDeleting: boolean;
    recordings: Record<string, true>;
    notes: Record<string, true>;
    categories: Record<string, true>;
}

export interface DeleteToolOpenedAction {
    type: typeof DELETE_TOOL_OPENED;
}

export interface DeleteToolToggleResourceAction {
    type: typeof DELETE_TOOL_RESOURCE_TOGGLED;
    payload: {
        bucket: "recordings" | "notes" | "categories";
        id: string;
    }
}

export interface DeleteToolSetDeletingAction {
    type: typeof DELETE_TOOL_SET_DELETING;
}

export interface DeleteToolDeletedAction {
    type: typeof DELETE_TOOL_DELETED;
}

export interface DeleteToolClosedAction {
    type: typeof DELETE_TOOL_CLOSED;
}

export type DeleteToolActionTypes =
    DeleteToolOpenedAction |
    DeleteToolToggleResourceAction |
    DeleteToolSetDeletingAction |
    DeleteToolDeletedAction |
    DeleteToolClosedAction |
    SearchToolOpenedAction;
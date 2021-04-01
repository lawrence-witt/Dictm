/* Search Tool Types */

export const SEARCH_TOOL_OPENED = "dictm/tools/search/TOOL_OPENED";
export const SEARCH_TERM_SET = "dictm/tools/search/TERM_SET";
export const SEARCH_TOOL_CLOSED = "dictm/tools/search/TOOL_CLOSED";

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
    SearchToolClosedAction;

/* Delete Tool Types */
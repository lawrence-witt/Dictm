import * as types from './types';

/* Search Tool Actions */

export const openSearchTool = (): types.SearchToolOpenedAction => ({
    type: types.SEARCH_TOOL_OPENED
});

export const setSearchTerm = (
    term: string
): types.SearchTermSetAction => ({
    type: types.SEARCH_TERM_SET,
    payload: {
        term
    }
});

export const closeSearchTool = (): types.SearchToolClosedAction => ({
    type: types.SEARCH_TOOL_CLOSED
});

/* Delete Tool Actions */
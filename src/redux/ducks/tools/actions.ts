import * as types from './types';

/* Nav Menu Actions */

export const openNavMenu = (): types.NavMenuOpenedAction => ({
    type: types.NAV_MENU_OPENED
});

export const closeNavMenu = (): types.NavMenuClosedAction => ({
    type: types.NAV_MENU_CLOSED
});

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

export const openDeleteTool = (): types.DeleteToolOpenedAction => ({
    type: types.DELETE_TOOL_OPENED
});

export const toggleDeleteResource = (
    bucket: "recordings" | "notes" | "categories",
    id: string
): types.DeleteToolToggleResourceAction => ({
    type: types.DELETE_TOOL_RESOURCE_TOGGLED,
    payload: {
        bucket,
        id
    }
});

export const setDeleteToolDeleting = (): types.DeleteToolSetDeletingAction => ({
    type: types.DELETE_TOOL_SET_DELETING
});

export const unsetDeleteToolDeleting = (): types.DeleteToolUnsetDeletingAction => ({
    type: types.DELETE_TOOL_UNSET_DELETING
});

export const commitDeleteTool = (): types.DeleteToolDeletedAction => ({
    type: types.DELETE_TOOL_DELETED
})

export const closeDeleteTool = (): types.DeleteToolClosedAction => ({
    type: types.DELETE_TOOL_CLOSED
});
import { ThunkResult } from '../../store';

import * as types from './types';
import * as actions from './actions';

/* 
*   Nav Menu Operations 
*/

/** 
*  Summary:
*  Toggle the open state of the navigation menu.
*/

export const toggleNavMenu = (): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { isOpen } = getState().tools.menu;

    dispatch(isOpen ? actions.closeNavMenu() : actions.openNavMenu());
}

/* 
*   Search Tool Operations 
*/

/* 
*   Summary:
*   Toggle the open state of the search tool.
*/

export const toggleSearchTool = (): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { isOpen } = getState().tools.search;
    const { isDeleting } = getState().tools.delete;

    if (isDeleting) return;

    dispatch(isOpen ? actions.closeSearchTool() : actions.openSearchTool());
};

/* 
*   Summary:
*   Update the value of the search term.
*/

export const setSearchTerm = (
    term: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.setSearchTerm(term));
}

/* 
*   Delete Tool Operations 
*/

/* 
*   Summary:
*   Toggle the open state of the search tool.
*/

export const toggleDeleteTool = (): ThunkResult<void> => (
    dispatch,
    getState
): void => {
    const { isOpen, isDeleting } = getState().tools.delete;

    if (isDeleting) return;

    dispatch(isOpen ? actions.closeDeleteTool() : actions.openDeleteTool());
};

/** 
*  Summary:
*  Toggles a resource for deletion by the delete tool.
*
*  @param type The type of resource to be toggled.
*  @param id The id of the toggled resource.
*/

export const toggleDeleteResource = (
    type: "recording" | "note" | "category",
    id: string
): ThunkResult<void> => (
    dispatch,
    getState
): void => {
    const { isDeleting } = getState().tools.delete;

    if (isDeleting) return;

    const bucket = {
        recording: "recordings" as const,
        note: "notes" as const,
        category: "categories" as const
    }[type];
    
    dispatch(actions.toggleDeleteResource(bucket, id));
}

/* 
*   Summary:
*   Deletes the resources marked by the delete tool.
*/

export const commitDeleteTool = (): ThunkResult<void> => (
    dispatch,
    getState
): void => {
    const { isDeleting } = getState().tools.delete;

    if (isDeleting) return;

    dispatch(actions.setDeleteToolDeleting());

    // delete the resources from DB
}
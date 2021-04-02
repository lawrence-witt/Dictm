import { ThunkAction } from 'redux-thunk';

import { RootState } from '../../store';

import * as types from './types';
import * as actions from './actions';

/* Search Tool Operations */

/* 
*   Summary:
*   Toggle the open state of the search tool.
*/

export const toggleSearchTool = (): ToggleSearchToolThunkAction => (
    dispatch,
    getState
): void => {
    const { isOpen } = getState().tools.search;
    const { isDeleting } = getState().tools.delete;

    if (isDeleting) return;

    dispatch(isOpen ? actions.closeSearchTool() : actions.openSearchTool());
};

type ToggleSearchToolThunkAction = ThunkAction<void, RootState, unknown, 
    types.SearchToolOpenedAction |
    types.SearchToolClosedAction
>

/* 
*   Summary:
*   Update the value of the search term.
*/

export const setSearchTerm = (
    term: string
): SetSearchTermThunkAction => (
    dispatch
): void => {
    dispatch(actions.setSearchTerm(term));
}

type SetSearchTermThunkAction = ThunkAction<void, undefined, unknown, types.SearchTermSetAction>;

/* Delete Tool Operations */

/* 
*   Summary:
*   Toggle the open state of the search tool.
*/

export const toggleDeleteTool = (): ToggleDeleteToolThunkAction => (
    dispatch,
    getState
): void => {
    const { isOpen, isDeleting } = getState().tools.delete;

    if (isDeleting) return;

    dispatch(isOpen ? actions.closeDeleteTool() : actions.openDeleteTool());
};

type ToggleDeleteToolThunkAction = ThunkAction<void, RootState, unknown, 
    types.DeleteToolOpenedAction |
    types.DeleteToolClosedAction
>

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
): ToggleDeleteResourceThunkAction => (
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

type ToggleDeleteResourceThunkAction = ThunkAction<void, RootState, unknown, types.DeleteToolToggleResourceAction>;

/* 
*   Summary:
*   Deletes the resources marked by the delete tool.
*/

export const commitDeleteTool = (): CommitDeleteToolThunkAction => (
    dispatch,
    getState
): void => {
    const { isDeleting } = getState().tools.delete;

    if (isDeleting) return;

    dispatch(actions.setDeleteToolDeleting());

    //
}

type CommitDeleteToolThunkAction = ThunkAction<void, RootState, unknown, any>;
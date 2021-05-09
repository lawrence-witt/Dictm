import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../redux/store';
import { toolOperations, toolSelectors } from '../../../../redux/ducks/tools';

const mapState = (state: RootState) => ({
    pageTitle: toolSelectors.getPageTitle(
        state.history.current, state.content.categories
    ),
    toolVisibility: toolSelectors.getToolVisibility(
        state.history.current
    ),
    searchIsOpen: state.tools.search.isOpen,
    deleteIsOpen: state.tools.delete.isOpen
});

const mapDispatch = {
    onToggleMenu: toolOperations.toggleNavMenu,
    onToggleSearch: toolOperations.toggleSearchTool,
    onToggleDelete: toolOperations.toggleDeleteTool
}

export const connector = connect(mapState, mapDispatch);

export type AppBarRowProps = ConnectedProps<typeof connector>;
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';

import ToolBarRow from './Row/ToolBarRow';
import SearchTool from './Tools/Search/SearchTool';
import DeleteTool from './Tools/Delete/DeleteTool';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    searchIsOpen: state.tools.search.isOpen,
    deleteIsOpen: state.tools.delete.isOpen
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const ToolBar: React.FC<ReduxProps> = (props) => {
    const {
        searchIsOpen,
        deleteIsOpen
    } = props;

    return (
        <ToolBarRow>
            {searchIsOpen ? <SearchTool/> : []}
            {deleteIsOpen ? <DeleteTool/> : []}
        </ToolBarRow>
    )
};

export default connector(ToolBar);
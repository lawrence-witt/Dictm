import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';

import AppBarRow from './Row';
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

const AppBar: React.FC<ReduxProps> = (props) => {
    const {
        searchIsOpen,
        deleteIsOpen
    } = props;

    return (
        <AppBarRow>
            {searchIsOpen ? <SearchTool/> : []}
            {deleteIsOpen ? <DeleteTool/> : []}
        </AppBarRow>
    )
};

export default connector(AppBar);
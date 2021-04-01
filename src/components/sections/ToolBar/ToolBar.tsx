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
    searchIsOpen: state.tools.search.isOpen
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const ToolBar: React.FC<ReduxProps> = (props) => {
    const {
        searchIsOpen
    } = props;

    return (
        <ToolBarRow>
            {searchIsOpen ? <SearchTool/> : null}
            {/* <DeleteTool 
                contentType="recordings"
                quantity={6}
            /> */}
        </ToolBarRow>
    )
};

export default connector(ToolBar);
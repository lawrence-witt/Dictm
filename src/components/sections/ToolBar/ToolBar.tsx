import React from 'react';

import ToolBarRow from './Row/ToolBarRow';
import SearchTool from './Tools/Search/SearchTool';
import DeleteTool from './Tools/Delete/DeleteTool';

import { ToolBarProps } from './ToolBar.types';

// Component

const ToolBar: React.FC<ToolBarProps> = (props) => {
    return (
        <ToolBarRow>
            {/* <SearchTool /> */}
            {/* <DeleteTool 
                contentType="recordings"
                quantity={6}
            /> */}
        </ToolBarRow>
    )
};

export default ToolBar;
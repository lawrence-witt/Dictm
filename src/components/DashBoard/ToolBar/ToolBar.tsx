import React from 'react';

import ToolBarRow from './Row/ToolBarRow';
import SearchTool from './Tools/Search/SearchTool';
import DeleteTool from './Tools/Delete/DeleteTool';

import { ToolBarProps } from './ToolBar.types';

// Component

const ToolBar: React.FC<ToolBarProps> = ({
    toggleMenu
}) => {


    return (
        <ToolBarRow
            toggleMenu={toggleMenu}
        >
            <SearchTool />
        </ToolBarRow>
    )
};

export default ToolBar;
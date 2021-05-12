import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';

import DropdownMenu from '../../../../../molecules/DropdownMenu/DropdownMenu';
import SaveButton from '../../../../../atoms/Buttons/SaveButton';

import * as types from './CategoryEditorButtons.types';

const CategoryPanelButtons: React.FC<types.CategoryEditorButtonsProps> = (props) => {
    const {
        saveAvailability,
        openDetailsDialog,
        saveEditor
    } = props;

    const onDetailsClick = React.useCallback((closeMenu: () => void) => {
        return () => {
            closeMenu();
            openDetailsDialog();
        }
    }, [openDetailsDialog]);

    return (
        <>
            <SaveButton
                color="inherit"
                disabled={!saveAvailability.hasRequiredProperties}
                onClick={saveEditor}
            />
            <DropdownMenu>
                {(closeMenu) => (
                    <MenuItem
                        onClick={onDetailsClick(closeMenu)}
                    >
                        Details
                    </MenuItem>
                )}
            </DropdownMenu>
        </>
    )
};

export default CategoryPanelButtons;
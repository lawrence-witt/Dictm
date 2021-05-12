import React from 'react';

import DropdownMenu from '../../../../../molecules/DropdownMenu/DropdownMenu';

import SaveButton from '../../../../../atoms/Buttons/SaveButton';
import { MenuItem } from '@material-ui/core';

import * as types from './NoteEditorButtons.types';

const NotePanelButtons: React.FC<types.NoteEditorButtonProps> = (props) => {
    const {
        saveAvailability,
        saveEditor,
        openDetailsDialog
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

export default NotePanelButtons;
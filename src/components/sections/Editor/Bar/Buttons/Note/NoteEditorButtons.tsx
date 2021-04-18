import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../../redux/ducks/editor';

import DropdownMenu from '../../../../../molecules/DropdownMenu/DropdownMenu';

import SaveButton from '../../../../../atoms/Buttons/SaveButton';
import { MenuItem } from '@material-ui/core';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state.editor)
});

const mapDispatch = {
    saveEditor: editorOperations.saveEditor,
    openDetailsDialog: editorOperations.openDetailsDialog
};

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const NotePanelButtons: React.FC<ReduxProps> = (props) => {
    const {
        canSave,
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
                disabled={!canSave}
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

export default connector(NotePanelButtons);
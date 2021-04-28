import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { RootState } from '../../../../../../redux/store';
import { editorSelectors, editorOperations } from '../../../../../../redux/ducks/editor';

import DropdownMenu from '../../../../../molecules/DropdownMenu/DropdownMenu';

import SaveButton from '../../../../../atoms/Buttons/SaveButton';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    saveAvailability: editorSelectors.getSaveAvailability(state.content, state.editor)
});

const mapDispatch = {
    saveEditor: editorOperations.saveEditor,
    openDetailsDialog: editorOperations.openDetailsDialog
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoryPanelButtons: React.FC<ReduxProps> = (props) => {
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

export default connector(CategoryPanelButtons);
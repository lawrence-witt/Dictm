import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { RootState } from '../../../../../redux/store';
import { editorSelectors, editorOperations } from '../../../../../redux/ducks/editor';
import { categoryEditorOperations } from '../../../../../redux/ducks/editor/category';

import DropdownMenu from '../../../../molecules/Menus/Dropdown/DropdownMenu';

import SaveButton from '../../../../atoms/Buttons/SaveButton';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state.editor)
});

const mapDispatch = {
    saveCategory: categoryEditorOperations.saveCategoryEditorModel,
    openDetailsDialog: editorOperations.openDetailsDialog
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoryPanelButtons: React.FC<ReduxProps> = (props) => {
    const {
        canSave,
        openDetailsDialog,
        saveCategory
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
                onClick={saveCategory}
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
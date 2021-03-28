import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorSelectors } from '../../../../../redux/ducks/editor';
import { categoryEditorOperations } from '../../../../../redux/ducks/editor/category';

import SaveButton from '../../../../atoms/Buttons/SaveButton';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state)
});

const mapDispatch = {
    saveCategory: categoryEditorOperations.saveCategoryEditorModel
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoryPanelButtons: React.FC<ReduxProps> = (props) => {
    const {
        canSave,
        saveCategory
    } = props;

    return (
        <SaveButton
            color="inherit"
            disabled={!canSave}
            onClick={saveCategory}
        />
    )
};

export default connector(CategoryPanelButtons);
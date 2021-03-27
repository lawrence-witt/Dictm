import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../redux/ducks/editor';

import SaveButton from '../../../../atoms/Buttons/SaveButton';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state)
});

const mapDispatch = {
    saveCategory: editorOperations.saveCategoryEditorModel
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
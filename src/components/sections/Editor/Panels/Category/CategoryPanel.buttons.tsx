import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../redux/ducks/editor';

import SaveButton from '../../../../atoms/Buttons/SaveButton';

/* 
*   Redux
*/

const mapButtonState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state)
});

const connector = connect(mapButtonState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoryPanelButtons: React.FC<ReduxProps> = (props) => {
    const {
        canSave
    } = props;

    return (
        <SaveButton
            color="inherit"
            disabled={!canSave}
        />
    )
};

export default connector(CategoryPanelButtons);
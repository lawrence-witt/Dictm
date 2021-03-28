import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorSelectors } from '../../../../../redux/ducks/editor';
import { noteEditorOperations } from '../../../../../redux/ducks/editor/note';

import SaveButton from '../../../../atoms/Buttons/SaveButton';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state)
});

const mapDispatch = {
    saveNote: noteEditorOperations.saveNoteEditorModel
};

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const NotePanelButtons: React.FC<ReduxProps> = (props) => {
    const {
        canSave,
        saveNote,
    } = props;

    return (
        <SaveButton
            color="inherit"
            disabled={!canSave}
            onClick={saveNote}
        />
    )
};

export default connector(NotePanelButtons);
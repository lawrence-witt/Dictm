import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../redux/ducks/editor';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { SaveDialogProps } from './SaveDialog.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    type: state.editor.context?.type,
    isNew: state.editor.attributes.isNew,
    canSave: editorSelectors.getSaveAvailability(state.editor)
});

const mapDispatch = {
    saveEditor: editorOperations.saveEditor,
    closeDialog: editorOperations.closeDialog,
    closeEditor: editorOperations.closeEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const SaveDialog: React.FC<ReduxProps> = (props) => {
    const {
        type,
        isNew,
        canSave,
        saveEditor,
        closeDialog,
        closeEditor
    } = props;

    const text = isNew ? 
    `Save your ${type} or discard it?` : 
    'Save your changes or discard them?';

    return (
        <>
            <DialogContent>
                <DialogContentText id="save-dialog-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    color="primary"
                    onClick={closeEditor}
                >
                    Discard
                </Button>
                <Button 
                    color="primary"
                    disabled={!canSave}
                    onClick={saveEditor}
                >
                    Save
                </Button>
                <Button 
                    color="primary"
                    onClick={closeDialog}
                >
                    Cancel
                </Button>
            </DialogActions>
        </>
    )
}

export default connector(SaveDialog);
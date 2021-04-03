import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../redux/ducks/editor';
import { recordingEditorOperations } from '../../../../../redux/ducks/editor/recording';
import { noteEditorOperations } from '../../../../../redux/ducks/editor/note';
import { categoryEditorOperations } from '../../../../../redux/ducks/editor/category';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { SaveDialogProps } from './SaveDialog.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state.editor)
});

const mapDispatch = {
    saveRecording: recordingEditorOperations.saveRecordingEditorModel,
    saveNote: noteEditorOperations.saveNoteEditorModel,
    saveCategory: categoryEditorOperations.saveCategoryEditorModel,
    closeDialog: editorOperations.closeDialog,
    closeEditor: editorOperations.closeEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const SaveDialog: React.FC<SaveDialogProps & ReduxProps> = (props) => {
    const {
        contentType,
        isNew,
        canSave,
        saveRecording,
        saveNote,
        saveCategory,
        closeDialog,
        closeEditor
    } = props;

    const text = isNew ? 
    `Save your ${contentType} or discard it?` : 
    'Save your changes or discard them?';

    const saveAction = React.useMemo(() => {
        switch(contentType) {
            case "recording": return saveRecording;
            case "note": return saveNote;
            case "category": return saveCategory;
            default: return () => ({});
        }
    }, [contentType, saveRecording, saveCategory, saveNote]);

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
                    onClick={saveAction}
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
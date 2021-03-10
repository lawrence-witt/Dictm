import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { SaveDialogProps } from './SaveDialog.types';

const SaveDialog: React.FC<SaveDialogProps> = (props) => {
    const {
        contentType,
        newContent
    } = props;

    const text = newContent ? 
    `Save your ${contentType} or discard it?` : 
    'Save your changes or discard them?';

    return (
        <>
            <DialogContent>
                <DialogContentText id="save-dialog-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary">
                    Discard
                </Button>
                <Button color="primary">
                    Save
                </Button>
                <Button color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </>
    )
}

export default SaveDialog;
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { RootState } from '../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../redux/ducks/editor';

import { DetailProps, DetailDialogProps } from './DetailsDialog.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    details: editorSelectors.getModelDetails(state.editor.context)
});

const mapDispatch = {
    onClose: editorOperations.closeDialog
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const Detail: React.FC<DetailProps> = (props) => {
    const {
        name,
        value
    } = props;

    return (
        <>
        <p>{name}</p>
        <p>{value}</p>
        </>
    );
}

const DetailsDialog: React.FC<DetailDialogProps> = (props) => {
    const {
        details,
        onClose
    } = props;

    return (
        <>
            {details.map(detail => (
                <Detail 
                    key={detail.name} 
                    name={detail.name} 
                    value={detail.value}
                />)
            )}
            <DialogActions>
                <Button 
                    color="primary"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </>
    );
}

export default connector(DetailsDialog);
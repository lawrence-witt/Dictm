import React from 'react';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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

/* 
*   Local
*/

const Detail: React.FC<DetailProps> = (props) => {
    const {
        name,
        value
    } = props;

    return (
        <ListItem>
            <ListItemText primary={name} secondary={value}/>
        </ListItem>
    );
}

const DetailsDialog: React.FC<DetailDialogProps> = (props) => {
    const {
        details,
        onClose
    } = props;

    return (
        <>
            <List style={{overflow: 'auto'}}>
                {details.map(detail => (
                    <Detail 
                        key={detail.name} 
                        name={detail.name} 
                        value={detail.value}
                    />)
                )}
            </List>
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
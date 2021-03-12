import React from 'react';

import MuiDialog from '@material-ui/core/Dialog';
import SaveDialog from './Save/SaveDialog';
import DetailsDialog from './Details/DetailsDialog';
import { makeStyles } from '@material-ui/core/styles';

import { DialogProps } from './Dialog.types';

const useDialogStyles = makeStyles(() => ({
    container: {
        position: 'absolute',
        width: '100%',
        maxWidth: 450,
        right: 0
    },
    paper: {
        flex: 1
    }
}));

const Dialog: React.FC<DialogProps> = (props) => {
    const {
        open,
        schema,
        ...other
    } = props;

    const classes = useDialogStyles();

    return (
        <MuiDialog
            open={open}
            aria-describedby="editor-dialog-description"
            classes={classes}
            {...other}
        >
            {schema.type === 'save' ? (
                <SaveDialog {...schema.props}/>
            ) : (
                <DetailsDialog {...schema.props}/>
            )}
        </MuiDialog>
    )
}

export default Dialog;
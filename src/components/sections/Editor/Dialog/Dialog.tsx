import React from 'react';

import MuiDialog from '@material-ui/core/Dialog';
import SaveDialog from './Save/SaveDialog';
import DetailsDialog from './Details/DetailsDialog';
import { makeStyles } from '@material-ui/core/styles';

import { DialogProps } from './Dialog.types';

/* 
*   Local
*/

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
        attributes,
        context,
        dialogs
    } = props;

    const classes = useDialogStyles();

    const dialogKey = dialogs.details.isOpen ? 
        "details"   : dialogs.save.isOpen ? 
        "save"      : "none";

    const RenderedDialog = React.useMemo(() => {
        switch(dialogKey) {
            case "save":
                return <SaveDialog contentType={context.type} isNew={attributes.isNew}/>;
            case "details":
                return <DetailsDialog/>;
            default:
                return null;
        }
    }, [dialogKey, attributes, context]);

    return (
        <MuiDialog
            open={dialogKey !== "none"}
            aria-describedby={`editor-${dialogKey}-dialog`}
            classes={classes}
        >
            {RenderedDialog}
        </MuiDialog>
    )
}

export default Dialog;
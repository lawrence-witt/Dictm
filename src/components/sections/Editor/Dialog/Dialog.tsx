import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../redux/store';

import MuiDialog from '@material-ui/core/Dialog';
import SaveDialog from './Save/SaveDialog';
import DetailsDialog from './Details/DetailsDialog';
import { makeStyles } from '@material-ui/core/styles';

import { DialogProps } from './Dialog.types';

/* 
*   Redux
*/

/* const mapState = (state: RootState) => ({
    editor: state.editor,
    canSave: editorSelectors.getSaveAvailability(state)
});

const mapDispatch = {
    openSaveDialog: editorOperations.openSaveDialog,
    closeEditor: editorOperations.closeEditor,
    clearEditor: editorOperations.clearEditor
}

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>; */

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

    const dialogKey = dialogs.details.isOpen ? "details" : dialogs.save.isOpen ? "save" : null;

    const RenderedDialog = React.useMemo(() => {
        switch(dialogKey) {
            case "save":
                return <SaveDialog contentType={context.type} isNew={attributes.isNew}/>;
            case "details":
                return <DetailsDialog nothing={""}/>;
            default:
                return null;
        }
    }, [dialogKey, attributes, context]);

    return (
        <MuiDialog
            open={Boolean(dialogKey)}
            aria-describedby="editor-dialog-description"
            classes={classes}
        >
            {RenderedDialog}
        </MuiDialog>
    )
}

export default Dialog;
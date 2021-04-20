import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../redux/store';

import MuiDialog from '@material-ui/core/Dialog';
import SaveDialog from './Save/SaveDialog';
import DetailsDialog from './Details/DetailsDialog';
import { makeStyles } from '@material-ui/core/styles';

/* 
*   Redux
*/


const mapState = (state: RootState) => ({
    dialogs: state.editor.dialogs
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

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

const Dialog: React.FC<ReduxProps> = (props) => {
    const {
        dialogs
    } = props;

    const classes = useDialogStyles();

    const dialogKey = dialogs.details.isOpen ? 
        "details"   : dialogs.save.isOpen ? 
        "save"      : "none";

    const RenderedDialog = React.useMemo(() => {
        switch(dialogKey) {
            case "save": return <SaveDialog />;
            case "details": return <DetailsDialog/>;
            default: return null;
        }
    }, [dialogKey]);

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

export default connector(Dialog);
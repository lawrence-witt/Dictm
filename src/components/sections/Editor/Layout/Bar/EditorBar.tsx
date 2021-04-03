import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../redux/ducks/editor';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import DirectionButton from '../../../../atoms/Buttons/DirectionButton';

import { EditorBarProps } from './EditorBar.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    title: state.editor.attributes.title,
    canSave: editorSelectors.getSaveAvailability(state.editor)
});

const mapDispatch = {
    openSaveDialog: editorOperations.openSaveDialog,
    closeEditor: editorOperations.closeEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useBarStyles = makeStyles(theme => ({
    drawerBar: {
        position: 'sticky',
        top: 0,
        height: 56,
        minHeight: 'unset',
        background: theme.palette.background.paper,
        zIndex: theme.zIndex.appBar,
        padding: `0px ${theme.spacing(2)}px`,
    },
    backButton: {
        marginRight: theme.spacing(1)
    },
    editorTitle: {
        marginRight: theme.spacing(1)
    },
    grow: {
        flex: 1
    }
}));

const EditorBar: React.FC<EditorBarProps & ReduxProps> = (props) => {
    const {
        title,
        canSave,
        openSaveDialog,
        closeEditor,
        children
    } = props;

    const classes = useBarStyles();

    // Handle editor close

    const onClose = React.useCallback(() => {
        if (canSave) {
            return openSaveDialog();
        }

        closeEditor();
    }, [canSave, openSaveDialog, closeEditor]);

    return (
        <Toolbar className={classes.drawerBar}>
            <DirectionButton 
                design="arrow" 
                direction="left"
                edge="start"
                color="inherit"
                className={classes.backButton}
                onClick={onClose}
            />
            <Typography
                variant="h6" 
                noWrap
                className={classes.editorTitle}
            >
                {title}
            </Typography>
            <div className={classes.grow}></div>
            {children}
        </Toolbar>
    );
};

export default connector(EditorBar);
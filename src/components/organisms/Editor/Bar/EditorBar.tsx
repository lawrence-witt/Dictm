import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../../redux/store';
import { editorSelectors, editorOperations } from '../../../../redux/ducks/editor';

import RecordingEditorButtons from './Buttons/Recording/RecordingEditorButtons';
import NoteEditorButtons from './Buttons/Note/NoteEditorButtons';
import CategoryEditorButtons from './Buttons/Category/CategoryEditorButtons';

import DirectionButton from '../../../atoms/Buttons/DirectionButton';
import FlexSpace from '../../../atoms/FlexSpace/FlexSpace';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    title: state.editor.attributes.title,
    context: state.editor.context,
    saveAvailability: editorSelectors.getSaveAvailability(state.content, state.editor)
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

const useStyles = makeStyles(theme => ({
    container: {
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
    title: {
        marginRight: theme.spacing(1)
    }
}));

const EditorBar: React.FC<ReduxProps> = (props) => {
    const {
        title,
        context,
        saveAvailability,
        openSaveDialog,
        closeEditor
    } = props;

    const classes = useStyles();

    const buttons = React.useMemo(() => {
        if (!context) return null;

        switch(context.type) {
            case "recording":
                return <RecordingEditorButtons mode={context.mode} model={context.model}/>
            case "note":
                return <NoteEditorButtons />
            case "category":
                return <CategoryEditorButtons/>
            default:
                return null;
        }
    }, [context]);

    const onClose = React.useCallback(() => {
        if (saveAvailability.hasNewProperties) return openSaveDialog();
        closeEditor();
    }, [saveAvailability, openSaveDialog, closeEditor]);

    return (
        <Toolbar className={classes.container}>
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
                className={classes.title}
            >
                {title}
            </Typography>
            <FlexSpace flex={1}/>
            {buttons}
        </Toolbar>
    )
}

export default connector(EditorBar);
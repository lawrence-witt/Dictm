import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../redux/store';
import { editorOperations, editorSelectors } from '../../../redux/ducks/editor';

import EditorBar from './Bar/EditorBar';
import EditorPanel from './Panel/EditorPanel';
import Dialog from './Dialog/Dialog';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    isOpen: state.editor.attributes.isOpen,
    context: state.editor.context,
    saveAvailability: editorSelectors.getSaveAvailability(state.content, state.editor)
});

const mapDispatch = {
    openSaveDialog: editorOperations.openSaveDialog,
    closeEditor: editorOperations.closeEditor,
    clearEditor: editorOperations.clearEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(() => ({
    paper: {
        width: '100%',
        maxWidth: 450,
        overflowX: 'hidden'
    }
}));

const Editor: React.FC<ReduxProps> = (props) => {
    const {
        isOpen,
        context,
        saveAvailability,
        openSaveDialog,
        closeEditor,
        clearEditor
    } = props;

    const classes = useStyles();

    const onClose = React.useCallback(() => {
        if (saveAvailability.hasNewProperties) return openSaveDialog();
        closeEditor();
    }, [saveAvailability, openSaveDialog, closeEditor]);

    return (
        <Drawer
            anchor="right"
            elevation={8}
            open={isOpen}
            onClose={onClose}
            SlideProps={{
                mountOnEnter: true,
                unmountOnExit: true,
                onExited: clearEditor
            }}
            classes={classes}
        >
            {context ? (
                <>
                    <EditorBar />
                    <EditorPanel context={context}/>
                    <Dialog />
                </>
            ) : null}
        </Drawer>
    )
};

export default connector(Editor);
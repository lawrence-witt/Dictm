import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { editorOperations, editorSelectors } from '../../../redux/ducks/editor';

import FocusDrawer from '../../molecules/Drawers/FocusDrawer';

import EditorBar from './Bar/EditorBar';
import EditorPanel from './Panel/EditorPanel';
import Dialog from './Dialog/Dialog';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    isOpen: state.editor.attributes.isOpen,
    context: state.editor.context,
    canSave: editorSelectors.getSaveAvailability(state.editor)
});

const mapDispatch = {
    openSaveDialog: editorOperations.openSaveDialog,
    closeEditor: editorOperations.closeEditor,
    clearEditor: editorOperations.clearEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

const Editor: React.FC<ReduxProps> = (props) => {
    const {
        isOpen,
        context,
        canSave,
        openSaveDialog,
        closeEditor,
        clearEditor
    } = props;

    const onClose = React.useCallback(() => {
        if (canSave) {
            return openSaveDialog();
        }

        closeEditor();
    }, [canSave, openSaveDialog, closeEditor]);

    return (
        <FocusDrawer
            open={isOpen}
            onClose={onClose}
            SlideProps={{
                mountOnEnter: true,
                unmountOnExit: true,
                onExited: clearEditor
            }}
        >
            {context ? (
                <>
                    <EditorBar />
                    <EditorPanel context={context}/>
                    <Dialog />
                </>
            ) : null}
        </FocusDrawer>
    )
};

export default connector(Editor);
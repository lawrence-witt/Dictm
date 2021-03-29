import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { editorOperations, editorSelectors } from '../../../redux/ducks/editor';

import FocusDrawer from '../../molecules/Drawers/FocusDrawer';
import EditorLayout from './Layout/Layout';

import Dialog from './Dialog/Dialog';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    editor: state.editor,
    canSave: editorSelectors.getSaveAvailability(state)
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

const Editor: React.FC<ReduxProps> = (props) => {
    const {
        editor,
        canSave,
        openSaveDialog,
        closeEditor,
        clearEditor
    } = props;

    // Handle editor close

    const onClose = React.useCallback(() => {
        if (canSave) {
            return openSaveDialog();
        }

        closeEditor();
    }, [canSave, openSaveDialog, closeEditor]);

    return (
        <FocusDrawer
            open={editor.attributes.isOpen}
            onClose={onClose}
            SlideProps={{
                mountOnEnter: true,
                unmountOnExit: true,
                onExited: clearEditor
            }}
        >
            {editor.context && (
                <>
                    <EditorLayout
                        context={editor.context}
                    />
                    <Dialog 
                        attributes={editor.attributes}
                        context={editor.context}
                        dialogs={editor.dialogs}
                    />
                </>
            )}
        </FocusDrawer>
    )
};

export default connector(Editor);
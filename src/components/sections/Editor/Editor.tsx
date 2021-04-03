import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { editorOperations, editorSelectors } from '../../../redux/ducks/editor';

import FocusDrawer from '../../molecules/Drawers/FocusDrawer';

import Dialog from './Dialog/Dialog';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    isOpen: state.editor.attributes.isOpen,
    canSave: editorSelectors.getSaveAvailability(state.editor)
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
        isOpen,
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
            open={isOpen}
            onClose={onClose}
            SlideProps={{
                mountOnEnter: true,
                unmountOnExit: true,
                onExited: clearEditor
            }}
        >
            <Dialog/>
        </FocusDrawer>
    )
};

export default connector(Editor);
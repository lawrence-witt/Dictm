import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../../redux/ducks/editor';

const mapState = (state: RootState) => ({
    saveAvailability: editorSelectors.getSaveAvailability(state.content, state.editor)
});

const mapDispatch = {
    saveEditor: editorOperations.saveEditor,
    openDetailsDialog: editorOperations.openDetailsDialog
};

export const connector = connect(mapState, mapDispatch);

export type NoteEditorButtonProps = ConnectedProps<typeof connector>;
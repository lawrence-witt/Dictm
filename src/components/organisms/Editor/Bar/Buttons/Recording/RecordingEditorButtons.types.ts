import { connect, ConnectedProps } from 'react-redux';

import Recording from '../../../../../../db/models/Recording';

import { editorOperations } from '../../../../../../redux/ducks/editor';
import { recordingEditorOperations } from '../../../../../../redux/ducks/editor/recording';

interface InjectedRecordingEditorButtonsProps {
    model: Recording;
}

const mapDispatch = {
    updateMode: recordingEditorOperations.updateRecordingEditorMode,
    openDetailsDialog: editorOperations.openDetailsDialog
}

export const connector = connect(null, mapDispatch);

type ConnectedRecordingEditorButtonsProps = ConnectedProps<typeof connector>;

export type RecordingEditorButtonsProps = InjectedRecordingEditorButtonsProps & ConnectedRecordingEditorButtonsProps;
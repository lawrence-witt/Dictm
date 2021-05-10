import Recording from '../../../../../../db/models/Recording';

export interface RecordingEditorButtonsProps {
    mode: "edit" | "play";
    model: Recording;
}
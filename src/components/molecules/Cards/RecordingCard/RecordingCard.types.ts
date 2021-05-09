import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../redux/store';
import { editorOperations } from '../../../../redux/ducks/editor';
import { toolOperations, toolSelectors } from '../../../../redux/ducks/tools';
import { contentSelectors } from '../../../../redux/ducks/content';

interface InjectedRecordingCardProps {
    id: string;
    title: string;
    duration: number;
    created: number;
}

const mapState = (state: RootState, props: InjectedRecordingCardProps) => ({
    isSecondaryActive: state.tools.delete.isOpen,
    isSecondarySelected: toolSelectors.getDeleteToggledStatus(
        state.tools.delete,
        "recordings",
        props.id
    ),
    durationFormatted: contentSelectors.getFormattedDuration(props.duration),
    createdFormatted: contentSelectors.getFormattedTimestamp(props.created)
});

const mapDispatch = {
    openEditor: editorOperations.openEditor,
    onToggleDelete: toolOperations.toggleDeleteResource
}

export const connector = connect(mapState, mapDispatch);

type ConnectedRecordingCardProps = ConnectedProps<typeof connector>;

export type RecordingCardProps = InjectedRecordingCardProps & ConnectedRecordingCardProps;
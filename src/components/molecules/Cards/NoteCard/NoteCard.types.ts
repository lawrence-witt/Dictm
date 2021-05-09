import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../redux/store';
import { editorOperations } from '../../../../redux/ducks/editor';
import { toolOperations, toolSelectors } from '../../../../redux/ducks/tools';
import { contentSelectors } from '../../../../redux/ducks/content';

interface InjectedNoteCardProps {
    id: string;
    title: string;
    data: {
        content: string;
        wordCount: number; 
        charCount: number;
    }
    created: number;
    inert?: boolean;
}

const mapState = (state: RootState, props: InjectedNoteCardProps) => ({
    isSecondaryActive: state.tools.delete.isOpen,
    isSecondarySelected: toolSelectors.getDeleteToggledStatus(
        state.tools.delete,
        "notes",
        props.id
    ),
    createdFormatted: contentSelectors.getFormattedTimestamp(props.created)
});

const mapDispatch = {
    openEditor: editorOperations.openEditor,
    onToggleDelete: toolOperations.toggleDeleteResource
}

export const connector = connect(mapState, mapDispatch);

type ConnectedNoteCardProps = ConnectedProps<typeof connector>;

export type NoteCardProps = InjectedNoteCardProps & ConnectedNoteCardProps;
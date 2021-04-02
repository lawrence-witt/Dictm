import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { editorOperations } from '../../../redux/ducks/editor';
import { toolOperations, toolSelectors } from '../../../redux/ducks/tools';

import Play from '@material-ui/icons/PlayArrow';

import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from './CardBase';

interface RecordingCardProps {
    id: string;
    title: string;
    duration: number;
    created: number;
}

/* 
*   Redux
*/

const mapState = (state: RootState, props: RecordingCardProps) => ({
    isSecondaryActive: state.tools.delete.isOpen,
    isSecondarySelected: toolSelectors.getDeleteToggledStatus(
        state.tools.delete,
        "recordings",
        props.id
    )
});

const mapDispatch = {
    openEditor: editorOperations.openEditor,
    onToggleDelete: toolOperations.toggleDeleteResource
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const RecordingCard: React.FC<RecordingCardProps & ReduxProps> = (props) => {
    const {
        id,
        title,
        duration,
        created,
        isSecondaryActive,
        isSecondarySelected,
        onToggleDelete,
        openEditor
    } = props;

    const onCardClick = React.useCallback(() => {
        openEditor("recording", id);
    }, [openEditor, id]);

    const onSecondaryAction = React.useCallback(() => {
        onToggleDelete("recording", id);
    }, [onToggleDelete, id]);

    return (
        <CardBase
            onCardClick={onCardClick}
            isSecondaryActive={isSecondaryActive}
        >
            <CardBasePrimaryRow
                title={title}
                subTitle={duration.toString()}
                createdDate={created.toString()}
            >
                <CardBaseActionSwitch 
                    primaryIcon={Play}
                    contained={true}
                    onSecondaryAction={onSecondaryAction}
                    isSecondaryActive={isSecondaryActive}
                    isSecondarySelected={isSecondarySelected}
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
};

export default connector(RecordingCard);
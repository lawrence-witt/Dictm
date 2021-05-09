import React from 'react';

import Play from '@material-ui/icons/PlayArrow';

import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from '../CardBase';

import * as types from './RecordingCard.types';

const RecordingCard: React.FC<types.RecordingCardProps> = (props) => {
    const {
        id,
        title,
        durationFormatted,
        createdFormatted,
        isSecondaryActive,
        isSecondarySelected,
        inert,
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
            inert={inert}
        >
            <CardBasePrimaryRow
                title={title}
                subTitle={durationFormatted}
                createdDate={createdFormatted}
            >
                <CardBaseActionSwitch 
                    primaryIcon={Play}
                    contained={true}
                    isPrimaryPlaceholder={true}
                    onSecondaryAction={onSecondaryAction}
                    isSecondaryActive={isSecondaryActive}
                    isSecondarySelected={isSecondarySelected}
                    inert={inert}
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
};

export default RecordingCard;
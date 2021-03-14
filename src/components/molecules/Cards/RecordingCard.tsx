import React from 'react';
import Play from '@material-ui/icons/PlayArrow';

import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from './CardBase';

interface RecordingCardProps {
    title: string;
    duration: number;
    created: number;
    onCardClick: () => void;
}

const RecordingCard: React.FC<RecordingCardProps> = (props) => {
    const {
        title,
        duration,
        created,
        onCardClick
    } = props;

    return (
        <CardBase
            onCardClick={onCardClick}
        >
            <CardBasePrimaryRow
                title={title}
                subTitle={duration.toString()}
                createdDate={created.toString()}
            >
                <CardBaseActionSwitch 
                    primaryIcon={Play}
                    contained={true}
                    onSecondaryAction={() => console.log('rec secondary')}
                    isSecondaryActive={false}
                    isSecondarySelected={false}
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
};

export default RecordingCard;
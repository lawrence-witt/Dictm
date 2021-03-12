import React from 'react';
import Play from '@material-ui/icons/PlayArrow';

import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from './CardBase';

interface RecordingCardProps {
    title: string;
    duration: number;
    createdAt: number;
}

const RecordingCard: React.FC<RecordingCardProps> = (props) => {
    const {
        title,
        duration,
        createdAt
    } = props;

    return (
        <CardBase>
            <CardBasePrimaryRow
                title={title}
                subTitle={duration.toString()}
                createdDate={createdAt.toString()}
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
import React from 'react';
import Play from '@material-ui/icons/PlayArrow';

import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from './CardBase';

const RecordingCard: React.FC = () => {
    return (
        <CardBase>
            <CardBasePrimaryRow
                title="Recording"
                subTitle="00:02"
                date="11 Nov 2020"
            >
                <CardBaseActionSwitch 
                    primaryIcon={Play}
                    contained={true}
                    onSecondaryAction={() => console.log('rec secondary')}
                    isSecondaryActive={true}
                    isSecondarySelected={false}
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
};

export default RecordingCard;
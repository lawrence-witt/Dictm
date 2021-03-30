import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { editorOperations } from '../../../redux/ducks/editor';

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

const mapDispatch = {
    openEditor: editorOperations.openEditor
}

const connector = connect(null, mapDispatch);

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
        openEditor
    } = props;

    const onCardClick = React.useCallback(() => {
        openEditor("recording", id);
    }, [openEditor, id]);

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

export default connector(RecordingCard);
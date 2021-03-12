import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../redux/store';

import { mediaSelectors } from '../../../redux/ducks/media';

import CardGrid from '../../molecules/Grids/CardGrid';
import RecordingCard from '../../molecules/Cards/RecordingCard';
import NoteCard from '../../molecules/Cards/NoteCard';

import { MediaTemplateProps } from './Media.types';

/* 
*   Redux
*/

const mapState = (state: RootState, props: MediaTemplateProps) => ({
    mediaList: mediaSelectors.getMediaList(state, props)
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const MediaTemplate: React.FC<MediaTemplateProps & ReduxProps> = (props) => {
    const {
        context,
        mediaList
    } = props;

    const history = useHistory();

    const onFabClick = React.useCallback(() => {
        const base = history.location.pathname;

        const editType = {
            recordings: "recording",
            notes: "note",
            category: "choose"
        }[context];

        history.push(`${base}?edit=${editType + (editType !== "choose" ? "&id=new" : "")}`);
    }, [context, history]);

    return (
        <CardGrid
            onFabClick={onFabClick}
        >
            {mediaList.allIds.map(id => {
                const item = mediaList.byId[id];

                return item.contentType === "recording" ? (
                    <RecordingCard
                        key={item.id}
                        title={item.title}
                        duration={item.audioData.duration}
                        createdAt={item.createdAt}
                    />
                ) : (
                    <NoteCard
                        key={item.id}
                        title={item.title}
                        details={item.details}
                        content={item.content}
                        createdAt={item.createdAt}
                    />
                );
            })}
        </CardGrid>
    )
}

export default connector(MediaTemplate);
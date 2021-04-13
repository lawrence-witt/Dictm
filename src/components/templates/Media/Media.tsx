import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { mediaSelectors } from '../../../redux/ducks/media';
import { editorOperations } from '../../../redux/ducks/editor';

import CardGrid from '../../molecules/Grids/CardGrid';
import RecordingCard from '../../molecules/Cards/RecordingCard';
import NoteCard from '../../molecules/Cards/NoteCard';

import { MediaTemplateProps } from './Media.types';

/* 
*   Redux
*/

const mapState = (state: RootState, props: MediaTemplateProps) => ({
    mediaList: mediaSelectors.getMediaList(
        state.media,
        state.categories,
        state.tools.search.term,
        props
    )
});

const mapDispatch = {
    openEditor: editorOperations.openEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const MediaTemplate: React.FC<MediaTemplateProps & ReduxProps> = (props) => {
    const {
        context,
        mediaList,
        openEditor
    } = props;

    const onFabClick = React.useCallback(() => {
        const editorType = {
            recordings: "recording" as const,
            notes: "note" as const,
            category: "choose" as const
        }[context];

        openEditor(editorType, "new");
    }, [context, openEditor]);

    return (
        <CardGrid
            onFabClick={onFabClick}
        >
            {mediaList.allIds.map(id => {
                const item = mediaList.byId[id];

                return item.type === "recording" ? (
                    <RecordingCard
                        key={item.id}
                        id={item.id}
                        title={item.attributes.title}
                        duration={item.data.audio.attributes.duration}
                        created={item.attributes.timestamps.created}
                    />
                ) : (
                    <NoteCard
                        key={item.id}
                        id={item.id}
                        title={item.attributes.title}
                        data={item.data}
                        created={item.attributes.timestamps.created}
                    />
                );
            })}
        </CardGrid>
    )
}

export default connector(MediaTemplate);
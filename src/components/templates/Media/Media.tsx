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
    mediaList: mediaSelectors.getMediaList(state, props)
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

        const contentId = editorType === "choose" ? undefined : "new";

        openEditor(editorType, contentId);
    }, [context, openEditor]);

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
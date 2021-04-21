import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { RootState } from '../../../../../redux/store';
import { contentSelectors } from '../../../../../redux/ducks/content';
import { editorOperations } from '../../../../../redux/ducks/editor';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

import MasonryGrid from '../../../../molecules/MasonryGrid/MasonryGrid';

import RecordingCard from '../../../../molecules/cards/RecordingCard';
import NoteCard from '../../../../molecules/cards/NoteCard';
import CategoryCard from '../../../../molecules/cards/CategoryCard';

import * as types from './Content.types';

/* 
*   Redux
*/

const mapState = (state: RootState, props: types.ContentTemplateProps) => ({
    contentList: contentSelectors.getContentList(
        state.content,
        props,
        state.tools.search.term
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

const useStyles = makeStyles(() => ({
    content: {
        display: 'grid',
        gridTemplate: 'auto min-content 0.1px / 100%',
        height: '100%',
        width: '100%',
        overflowY: 'auto',

        // Fix for grid/sticky glitch on FireFox
        // https://stackoverflow.com/questions/60517169/grid-items-overlapping-with-position-sticky
        "&:after": {
            content: "''"
        },

        "& .card-grid": {
            display: 'flex',
            height: '100%',
            width: '100%',
            padding: 8,
        },
        "& .card-col": {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'flex-start',
            padding: 8,

            "& > div:not(:last-child)": {
                marginBottom: 16
            }
        }
    },
    fab: {
        position: 'sticky',
        justifySelf: 'end',
        width: 50,
        height: 50,
        bottom: 16,
        right: 16,
        marginTop: 16
    }
}))

const Content: React.FC<types.ContentTemplateProps & ReduxProps> = (props) => {
    const {
        context,
        categoryId,
        contentList,
        openEditor
    } = props;

    const classes = useStyles();

    const onFabClick = React.useCallback(() => {
        const editorType = {
            recordings: "recording" as const,
            notes: "note" as const,
            categories: categoryId ? 
                "choose" as const : 
                "category" as const
        }[context];

        openEditor(editorType, "new");
    }, [context, categoryId, openEditor]);

    if (!contentList) {
        return <Redirect to="/" />;
    }

    return (
        <div className={classes.content}>
            <MasonryGrid
                gridClass="card-grid"
                columnClass="card-col"
            >
                {contentList.allIds.map(id => {
                    const item = contentList.byId[id];

                    const common = {
                        key: item.id,
                        id: item.id,
                        title: item.attributes.title
                    }

                    switch (item.type) {
                        case "recording":
                            return (
                                <RecordingCard
                                    {...common}
                                    duration={item.data.audio.attributes.duration}
                                    created={item.attributes.timestamps.created}
                                />
                            )
                        case "note":
                            return (
                                <NoteCard
                                    {...common}
                                    data={item.data}
                                    created={item.attributes.timestamps.created}
                                />
                            )
                        case "category":
                            return (
                                <CategoryCard
                                    {...common}
                                />
                            )
                    }
                })}
            </MasonryGrid>
            <Fab 
                onClick={onFabClick}
                color="secondary" 
                className={classes.fab}
            >
                <AddIcon/>
            </Fab>
        </div>
    )
}

export default connector(Content);
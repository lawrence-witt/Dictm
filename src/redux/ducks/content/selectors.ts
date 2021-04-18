import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { formatDuration, formatShortTimestamp } from '../../../lib/utils/formatTime';

/* 
*   Get models for Content template to display
*/

interface ContentTemplateProps {
    context: "recordings" | "notes" | "categories";
    categoryId?: string;
}

const contentMatchesFilter = (
    title: string,
    filter: string
) => {
    return title.toLowerCase().includes(filter.toLowerCase());
}

const getContentSlice = (
    state: RootState["content"]["recordings" | "notes" | "categories"], 
    ids: string[],
    filter: string
) => (
    ids.reduce((slice: typeof state, id) => {
        const media = state.byId[id];

        if (filter.length > 0) {
            if (!contentMatchesFilter(media.attributes.title, filter)) {
                return slice;
            }
        }

        slice.byId[id] = media;
        slice.allIds.push(id);

        return slice;
    }, {byId: {}, allIds: []})
);

export const getContentList = createSelector((
    content: RootState["content"],
    props: ContentTemplateProps,
    filter: string
) => {

    // Return single type content list if no category id

    if (!props.categoryId) {
        const contentStore = content[props.context];

        if (filter.length === 0) return contentStore;

        return getContentSlice(contentStore, contentStore.allIds, filter);
    }

    // Sort category resources into new content list by timestamp

    const category = content.categories.byId[props.categoryId];

    if (!category) return null;

    const recordingsSlice = getContentSlice(
        content.recordings,
        category.relationships.recordings.ids,
        filter
    );

    const notesSlice = getContentSlice(
        content.notes,
        category.relationships.notes.ids,
        filter
    );

    const byId = Object.assign({}, recordingsSlice.byId, notesSlice.byId);
    const allIds = [...recordingsSlice.allIds, ...notesSlice.allIds].sort((a, b) => {
        const aModel = recordingsSlice.byId[a] || notesSlice.byId[a];
        const bModel = recordingsSlice.byId[b] || notesSlice.byId[b];

        return aModel.attributes.timestamps.created - bModel.attributes.timestamps.created;
    });

    return { byId, allIds };
}, contentList => contentList);

/* export const getMediaList = createSelector((
    media: RootState["content"],
    categories: RootState["categories"],
    filter: RootState["tools"]["search"]["term"], 
    props: MediaTemplateProps
) => {
    // Return default media list if no category specified

    if (props.context !== "category") {
        const mediaState = media[props.context];

        if (filter.length === 0) return mediaState;

        return getMediaSlice(mediaState, mediaState.allIds, filter);
    }

    if (!props.categoryId) throw new Error('selector: getMediaList missing a categoryId');

    //Sort category resources into new media list by timestamps.created

    const { recordings, notes } = media;

    const category = categories.byId[props.categoryId];

    const recordingsSlice = getMediaSlice(
        recordings, 
        category.relationships.recordings.ids, 
        filter
    );

    const notesSlice = getMediaSlice(
        notes, 
        category.relationships.notes.ids,
        filter
    );
    
    const byId = Object.assign({}, recordingsSlice.byId, notesSlice.byId);
    const allIds = [...recordingsSlice.allIds, ...notesSlice.allIds].sort((a, b) => {
        const aModel = recordingsSlice.byId[a] || notesSlice.byId[a];
        const bModel = recordingsSlice.byId[b] || notesSlice.byId[b];

        return aModel.attributes.timestamps.created - bModel.attributes.timestamps.created;
    });

    return { byId, allIds };
}, mediaList => mediaList); */

/* 
*   Get media by category and title for select inputs
*/

export const getMediaByTitleAndCategory = createSelector((
    content: RootState["content"], 
    context: "recordings" | "notes"
) => {
    const mediaList = content[context];

    return mediaList.allIds.map(id => ({
        id,
        title: mediaList.byId[id].attributes.title,
        category: (() => {
            const assignedCategory = mediaList.byId[id].relationships.category.id;

            if (!assignedCategory) return undefined;

            return {
                id: assignedCategory,
                title: content.categories.byId[assignedCategory].attributes.title
            }
        })()
    }))
}, mediaData => mediaData);

/* 
*   Get a string formatted duration value
*/

export const getFormattedDuration = createSelector((
    duration: number
) => {
    const { m, s } = formatDuration(duration);
    return `${m}:${s}`;
}, formatted => formatted);

/* 
*   Get a string formatted time stamp
*/

export const getFormattedTimestamp = createSelector((
    timestamp: number
) => {
    return formatShortTimestamp(timestamp);
}, formatted => formatted);
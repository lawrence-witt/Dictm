import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { formatDuration, formatShortTimestamp } from '../../../lib/utils/FormatTime';

/* 
*   Select media models for card display
*/

interface MediaTemplateProps {
    context: "recordings" | "notes" | "category";
    categoryId?: string;
}

const mediaMatchesFilter = (
    title: string,
    filter: string
) => {
    return title.toLowerCase().includes(filter.toLowerCase());
}

const getMediaSlice = (
    state: RootState["media"]["recordings" | "notes"], 
    ids: string[],
    filter: string
) => (
    ids.reduce((slice: typeof state, id) => {
        const media = state.byId[id];

        if (filter.length > 0) {
            if (!mediaMatchesFilter(media.attributes.title, filter)) {
                return slice;
            }
        }

        slice.byId[id] = media;
        slice.allIds.push(id);

        return slice;
    }, {byId: {}, allIds: []})
);

export const getMediaList = createSelector((
    media: RootState["media"],
    categories: RootState["categories"],
    filter: RootState["tools"]["search"]["term"], 
    props: MediaTemplateProps
) => {
    /* Return default media list if no category specified */

    if (props.context !== "category") {
        const mediaState = media[props.context];

        if (filter.length === 0) return mediaState;

        return getMediaSlice(mediaState, mediaState.allIds, filter);
    }

    if (!props.categoryId) throw new Error('selector: getMediaList missing a categoryId');

    /* Sort category resources into new media list by timestamps.created */

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
}, mediaList => mediaList);

/* 
*   Select media category data
*/

export const getMediaByTitleAndCategory = createSelector((
    state: RootState, 
    context: "recordings" | "notes"
) => {
    const mediaList = state.media[context];

    return mediaList.allIds.map(id => ({
        id,
        title: mediaList.byId[id].attributes.title,
        category: (() => {
            const assignedCategory = mediaList.byId[id].relationships.category;

            if (!assignedCategory) return undefined;

            return {
                id: assignedCategory.id,
                title: state.categories.byId[assignedCategory.id].attributes.title
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
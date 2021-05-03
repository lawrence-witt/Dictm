import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { sortFunctions, ContentSlice } from './helpers';

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
    profile: RootState["user"]["profile"],
    props: ContentTemplateProps,
    filter: string
) => {
    if (!profile) return null;

    const { context, categoryId } = props;

    const sortKey = categoryId && context === "categories" ? "mixed" : context;
    const sortOrder = profile.settings.display.sort[sortKey];
    const sortFunction = sortFunctions[sortOrder];

    let byId: ContentSlice["byId"];
    let allIds: ContentSlice["allIds"];

    if (!props.categoryId) {
        const contentStore = content[props.context];

        const unsorted = filter.length === 0 ?
            contentStore : 
            getContentSlice(contentStore, contentStore.allIds, filter);
        
        byId = unsorted.byId;
        allIds = unsorted.allIds;
    } else {
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

        byId = Object.assign({}, recordingsSlice.byId, notesSlice.byId);
        allIds = [...recordingsSlice.allIds, ...notesSlice.allIds];
    }

    return sortFunction(byId, allIds);
}, contentList => contentList);

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
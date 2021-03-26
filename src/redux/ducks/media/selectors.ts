import { createSelector } from 'reselect';

import { RootState } from '../../store';

/* 
*   Select media models for card display
*/

interface MediaTemplateProps {
    context: "recordings" | "notes" | "category";
    categoryId?: string;
}

const getMediaSlice = (state: RootState["media"]["recordings" | "notes"], ids: string[]) => (
    ids.reduce((slice: typeof state, id) => {
        slice.byId[id] = state.byId[id];
        slice.allIds.push(id);
        return slice;
    }, {byId: {}, allIds: []})
);

export const getMediaList = createSelector((state: RootState, props: MediaTemplateProps) => {
    if (props.context !== "category") return state.media[props.context];

    if (!props.categoryId) throw new Error('selector: getMediaList missing a categoryId');

    const category = state.categories.byId[props.categoryId];

    const recordingsSlice = getMediaSlice(state.media.recordings, category.relationships.recordings.ids);
    const notesSlice = getMediaSlice(state.media.notes, category.relationships.notes.ids);
    
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

export const getMediaByTitleAndCategory = createSelector((state: RootState, context: "recordings" | "notes") => {
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
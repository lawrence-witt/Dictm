import { createSelector } from 'reselect';

import { RootState } from '../../store';

interface MediaTemplateProps {
    context: "recordings" | "notes" | "category";
    categoryId?: string;
}

const getMediaSlice = (state: RootState["media"]["recordings" | "notes"], ids: string[]) => {
    return ids.reduce((slice: typeof state, id) => {
        slice.byId[id] = state.byId[id];
        slice.allIds.push(id);
        return slice;
    }, {byId: {}, allIds: []});
}

const createMediaList = (state: RootState, props: MediaTemplateProps) => {
    switch(props.context) {
        case "recordings":
            return state.media.recordings;
        case "notes":
            return state.media.notes;
        case "category": {
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
        }
        default:
            throw new Error('selector: getMediaList supplied with invalid props');
    }
};

const getMediaList = createSelector(createMediaList, (mediaList) => mediaList);

export { getMediaList };
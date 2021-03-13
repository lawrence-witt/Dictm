import { RootState } from '../../store';
import { ContentModelTypes, ContentModels, EditorModelTypes, EditorModels } from './types'

import { generateRecordingModel } from '../../_data/recordingsData';
import { generateNoteModel } from '../../_data/notesData';
import { generateCategoryModel } from '../../_data/categoriesData';

export const generateContentModel = (
    contentType: EditorModelTypes,
    userId: string
): {title: string, model: EditorModels} => {
    switch(contentType) {
        case "choose":
            return {title: "Choose New Content", model: { id: "new", contentType }};
        case "recording":
            return {title: "New Recording", model: generateRecordingModel(userId)};
        case "note":
            return {title: "New Note", model: generateNoteModel(userId)};
        case "category":
            return {title: "New Category", model: generateCategoryModel(userId)};
        default:
            throw Error('generateContentModel: invalid params');
    }
}

export const findContentModel = (
    media: RootState["media"],
    categories: RootState["categories"],
    contentType: ContentModelTypes,
    contentId?: string
): ContentModels | undefined => {
    if (!contentId) return undefined;
    
    switch (contentType) {
        case "recording":
            return media.recordings.byId[contentId];
        case "note":
            return media.notes.byId[contentId];
        case "category":
            return categories.byId[contentId];
        default:
            return undefined;
    }
}
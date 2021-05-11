import { RootState } from '../../store';
import { ContentModelTypes, ContentModels, EditorModelTypes, EditorModels, EditorContexts } from './types';

import Recording from '../../../db/models/Recording';
import Note from '../../../db/models/Note';
import Category from '../../../db/models/Category';

/* 
*   Create and find content models
*/

export const generateContentModel = (
    type: EditorModelTypes,
    userId: string,
    newContentCategoryId?: string
): EditorModels => {
    switch(type) {
        case "choose":
            return { type, categoryId: newContentCategoryId };
        case "recording":
            return new Recording(userId, newContentCategoryId);
        case "note":
            return new Note(userId, newContentCategoryId);
        case "category":
            return new Category(userId);
        default:
            throw Error('generateContentModel: invalid params');
    }
}

export const findContentModel = (
    content: RootState["content"],
    type: ContentModelTypes,
    id: string
): ContentModels | undefined => {    
    switch (type) {
        case "recording":
            return content.recordings.byId[id];
        case "note":
            return content.notes.byId[id];
        case "category":
            return content.categories.byId[id];
        default:
            return undefined;
    }
}

/* 
*   Timestamp models on editor save
*/

export const stampContentModel = <M extends ContentModels>(
    model: M
): M => ({
    ...model,
    attributes: {
        ...model.attributes,
        timestamps: {
            created: (c => c === 0 ? Date.now() : c)(model.attributes.timestamps.created),
            modified: Date.now()
        }
    }
});

/* 
*   Create editor contexts
*/

const generateRecordingContext = (
    isNew: boolean,
    model: Recording
): EditorContexts["recording"] => ({
    type: "recording",
    mode: isNew ? "edit" : "play",
    isSaveRequested: false,
    model
});

const generateNoteContext = (
    model: Note
): EditorContexts["note"] => ({
    type: "note",
    model
});

const generateCategoryContext = (
    model: Category
): EditorContexts["category"] => ({
    type: "category",
    model
});


export function generateEditorContext(
    model: EditorModels,
    isNew: boolean
): {
    title: string; 
    context: EditorContexts[keyof EditorContexts]
} {
    const title = (() => {
        if (model.type === "choose") return "Choose New Content";

        return {
            recording: isNew ? "New Recording" : model.attributes.title,
            note: isNew ? "New Note" : model.attributes.title,
            category: isNew ? "New Category" : model.attributes.title
        }[model.type]
    })();

    switch(model.type) {
        case "choose":
            return {title, context: model};
        case "recording":
            return {title, context: generateRecordingContext(isNew, model)};
        case "note":
            return {title, context: generateNoteContext(model)};
        case "category":
            return {title, context: generateCategoryContext(model)};
    }
}
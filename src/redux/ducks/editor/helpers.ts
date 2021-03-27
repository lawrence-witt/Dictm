import { RootState } from '../../store';
import { ContentModelTypes, ContentModels, EditorModelTypes, EditorModels, EditorContexts } from './types';

import { generateNewRecordingModel, RecordingModel } from '../../_data/recordingsData';
import { generateNewNoteModel, NoteModel } from '../../_data/notesData';
import { generateNewCategoryModel, CategoryModel } from '../../_data/categoriesData';

/* 
*   Create and find content models
*/

export const generateContentModel = (
    type: EditorModelTypes,
    userId: string
): EditorModels => {
    switch(type) {
        case "choose":
            return { type };
        case "recording":
            return generateNewRecordingModel(userId);
        case "note":
            return generateNewNoteModel(userId);
        case "category":
            return generateNewCategoryModel(userId);
        default:
            throw Error('generateContentModel: invalid params');
    }
}

export const findContentModel = (
    media: RootState["media"],
    categories: RootState["categories"],
    type: ContentModelTypes,
    id: string
): ContentModels | undefined => {    
    switch (type) {
        case "recording":
            return media.recordings.byId[id];
        case "note":
            return media.notes.byId[id];
        case "category":
            return categories.byId[id];
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

const generateChooseContext = (): EditorContexts["choose"] => ({
    type: "choose"
});

const generateRecordingContext = (
    isNew: boolean,
    model: RecordingModel
): EditorContexts["recording"] => ({
    type: "recording",
    mode: isNew ? "edit" : "play",
    data: {
        original: model,
        editing: model
    }
});

const generateNoteContext = (
    model: NoteModel
): EditorContexts["note"] => ({
    type: "note",
    data: {
        original: model,
        editing: model
    }
});

const generateCategoryContext = (
    model: CategoryModel
): EditorContexts["category"] => ({
    type: "category",
    data: {
        original: model,
        editing: model
    }
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
            return {title, context: generateChooseContext()};
        case "recording":
            return {title, context: generateRecordingContext(isNew, model)};
        case "note":
            return {title, context: generateNoteContext(model)};
        case "category":
            return {title, context: generateCategoryContext(model)};
    }
}
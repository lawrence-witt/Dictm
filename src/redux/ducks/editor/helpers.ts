import { RootState } from '../../store';
import { ContentModelTypes, ContentModels, EditorModelTypes, EditorModels, EditorContexts } from './types';

import { generateNewRecordingModel, RecordingModel } from '../../_data/recordingsData';
import { generateNewNoteModel, NoteModel } from '../../_data/notesData';
import { generateNewCategoryModel, CategoryModel } from '../../_data/categoriesData';

/* 
*   Create and Find Content Models
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
*   Create Editor Contexts
*/

const generateChooseContext = (): EditorContexts["choose"] => ({
    type: "choose",
    attributes: {
        title: "Choose New Content"
    },
    data: undefined,
    dialogs: undefined
});

const generateRecordingContext = (
    isNew: boolean,
    model: RecordingModel
): EditorContexts["recording"] => ({
    type: "recording",
    attributes: {
        title: isNew ? "New Recording" : model.attributes.title,
        isNew,
        mode: isNew ? "edit" : "play"
    },
    data: {
        original: model,
        edited: model
    },
    dialogs: {
        save: {
            isOpen: false
        },
        details: {
            isOpen: false
        }
    }
});

const generateNoteContext = (
    isNew: boolean,
    model: NoteModel
): EditorContexts["note"] => ({
    type: "note",
    attributes: {
        title: isNew ? "New Note" : model.attributes.title,
        isNew
    },
    data: {
        original: model,
        edited: model
    },
    dialogs: {
        save: {
            isOpen: false
        }
    }
});

const generateCategoryContext = (
    isNew: boolean,
    model: CategoryModel
): EditorContexts["category"] => ({
    type: "category",
    attributes: {
        title: isNew ? "New Category" : model.attributes.title,
        isNew
    },
    data: {
        original: model,
        edited: model
    },
    dialogs: {
        save: {
            isOpen: false
        }
    }
});


export function generateEditorContext(
    model: EditorModels,
    isNew: boolean
): EditorContexts[keyof EditorContexts] {
    switch(model.type) {
        case "choose":
            return generateChooseContext();
        case "recording":
            return generateRecordingContext(isNew, model);
        case "note":
            return generateNoteContext(isNew, model);
        case "category":
            return generateCategoryContext(isNew, model);
    }
}
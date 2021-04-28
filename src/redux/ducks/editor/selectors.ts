import { createSelector } from "reselect";

import { RootState } from "../../store";
import { ContentModels } from './types';

import Recording from '../../../db/models/Recording';
import Note from '../../../db/models/Note';
import Category from "../../../db/models/Category";

import { formatLongTimestamp, formatDuration } from '../../../lib/utils/formatTime';
import { formatStringBytes } from '../../../lib/utils/formatFileSize';

const stringArraysEqual = (arr1: string[], arr2: string[]) => {
    const asSet = new Set([...arr1, ...arr2]);
    return asSet.size === arr1.length && asSet.size === arr2.length;
}

const blankRecording = new Recording("");
const blankNote = new Note("");
const blankCategory = new Category("");

/* 
*   Decide whether the editing model can be saved.
*/

const isTitleValid = (editing: ContentModels) => {
    return editing.attributes.title.length > 0;
}

const isTitleDifferent = (original: ContentModels, editing: ContentModels) => {
    return original.attributes.title !== editing.attributes.title;
}

const isCategoryDifferent = (original: Recording | Note, editing: Recording | Note) => {
    return original.relationships.category.id !== editing.relationships.category.id;
}

const getRecordingSaveAvailability = ( 
    original: Recording | undefined, 
    editing: Recording
) => {
    if (!original) original = blankRecording;
    
    const isDataDifferent = (original: Recording, editing: Recording) => {
        const originalModified = original.data.audio.attributes.timestamps.modified;
        const editingModified = editing.data.audio.attributes.timestamps.modified;
        return originalModified !== editingModified;
    }

    const hasNewProperties = (
        isTitleDifferent(original, editing) ||
        isCategoryDifferent(original, editing) ||
        isDataDifferent(original, editing)
    );

    const hasRequiredProperties = isTitleValid(editing) && hasNewProperties;

    return { hasRequiredProperties, hasNewProperties };
}

const getNoteSaveAvailability = (
    original: Note | undefined, 
    editing: Note
) => {
    if (!original) original = blankNote;

    const isDataDifferent = (original: Note, editing: Note) => {
        return original.data.content !== editing.data.content;
    }

    const hasNewProperties = (
        isTitleDifferent(original, editing) ||
        isCategoryDifferent(original, editing) ||
        isDataDifferent(original, editing)
    );

    const hasRequiredProperties = isTitleValid(editing) && hasNewProperties;

    return { hasRequiredProperties, hasNewProperties };
}

const getCategorySaveAvailability = (
    original: Category | undefined, 
    editing: Category
) => {
    if (!original) original = blankCategory;

    const isDataDifferent = (original: Category, editing: Category) => {
        const originalRecordingIds = original.relationships.recordings.ids;
        const editingRecordingIds = editing.relationships.recordings.ids;
        const originalNoteIds = original.relationships.notes.ids;
        const editingNoteIds = editing.relationships.notes.ids;

        return (
            !stringArraysEqual(originalRecordingIds, editingRecordingIds) ||
            !stringArraysEqual(originalNoteIds, editingNoteIds)
        )
    }

    const hasNewProperties = (
        isTitleDifferent(original, editing) ||
        isDataDifferent(original, editing)
    )

    const hasRequiredProperties = isTitleValid(editing) && hasNewProperties;

    return { hasRequiredProperties, hasNewProperties };
}

export const getSaveAvailability = createSelector((
    contentState: RootState["content"], 
    editorState: RootState["editor"]
) => {
    const { recordings, notes, categories } = contentState;
    const { attributes: { isSaving }, context } = editorState;

    const defaultAvailability = {
        hasRequiredProperties: false,
        hasNewProperties: false
    }

    if (isSaving || !context || context.type === "choose") return defaultAvailability;

    const contentId = context.model.id;

    switch (context.type) {
        case "recording":
            return getRecordingSaveAvailability(recordings.byId[contentId], context.model);
        case "note":
            return getNoteSaveAvailability(notes.byId[contentId], context.model);
        case "category":
            return getCategorySaveAvailability(categories.byId[contentId], context.model);
        default:
            return defaultAvailability;
    }
}, saveAvailability => saveAvailability);

/* 
*   Format the details of the editing model
*/

// Base

const createDetail = (
    name: string,
    value: string
) => ({ name, value });

// Generic

const createStampDetails = (
    model: ContentModels
) => ([
    createDetail(
        "Created", 
        formatLongTimestamp(model.attributes.timestamps.created)
    ),
    createDetail(
        "Last Modified",
        formatLongTimestamp(model.attributes.timestamps.modified)
    )
]);

// Media

const createDurationDetail = (
    model: Recording
) => createDetail(
    "Duration",
    (() => {
        const { m, s, cs } = formatDuration(model.data.audio.attributes.duration);
        return `${m}:${s}.${cs}`;
    })()
);

const createSampleRateDetail = (
    model: Recording
) => createDetail(
    "Sample Rate",
    model.data.audio.attributes.sampleRate.toString()
);

const createNoteCountDetail = (
    model: Note
) => ([
    createDetail("Word Count", model.data.wordCount.toString()),
    createDetail("Charater Count", model.data.charCount.toString())
])

const createSizeDetail = (
    model: Recording | Note
) => createDetail(
    "Size",
    model.type === "recording" ?
    model.data.audio.attributes.size :
    formatStringBytes(model.data.content)
);

// Combined Details

const createWrappedDetails = (
    model: ContentModels,
    details: ReturnType<typeof createDetail>[] = []
) => ([
    createDetail("Title", model.attributes.title),
    ...details,
    ...createStampDetails(model)
]);

const createRecodingDetails = (
    model: Recording
) => createWrappedDetails(
    model,
    [
        createDurationDetail(model),
        createSampleRateDetail(model),
        createSizeDetail(model),
    ]
);

const createNoteDetails = (
    model: Note
) => createWrappedDetails(
    model,
    [
        ...createNoteCountDetail(model),
        createSizeDetail(model),
    ]
);

export const getModelDetails = createSelector((
    context: RootState["editor"]["context"]
) => {
    if (!context || context.type === "choose") return [];

    switch(context.type) {
        case "recording": 
            return createRecodingDetails(context.model);
        case "note":
            return createNoteDetails(context.model);
        case "category":
            return createWrappedDetails(context.model);
        default:
            return []
    }
}, details => details);
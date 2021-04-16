import { createSelector } from "reselect";

import { RootState } from "../../store";
import { ContentModels } from './types';

import Recording from '../../../db/models/Recording';
import Note from '../../../db/models/Note';

import { formatLongTimestamp, formatDuration } from '../../../lib/utils/FormatTime';
import { formatByteLength, formatStringBytes } from '../../../lib/utils/FormatFileSize';

const stringArraysEqual = (arr1: string[], arr2: string[]) => {
    const asSet = new Set([...arr1, ...arr2]);
    return asSet.size === arr1.length && asSet.size === arr2.length;
}

/* 
*   Decide whether the editing model can be saved.
*/

export const getSaveAvailability = createSelector((editorState: RootState["editor"]) => {
    const { attributes, context } = editorState;

    if (attributes.isSaving || !context || context.type === "choose") return false;

    const checkTitleDifferent = () => {
        const originalTitle = context.data.original.attributes.title;
        const editingTitle = context.data.editing.attributes.title;
        return originalTitle !== editingTitle;
    };

    if (context.type === "category") {
        const idsDifferent = (() => {
            const originalRecordingIds = context.data.original.relationships.recordings.ids;
            const editingRecordingIds = context.data.editing.relationships.recordings.ids;
            const originalNoteIds = context.data.original.relationships.notes.ids;
            const editingNoteIds = context.data.editing.relationships.notes.ids;

            return (
                !stringArraysEqual(originalRecordingIds, editingRecordingIds) || 
                !stringArraysEqual(originalNoteIds, editingNoteIds)
            );
        })();

        return checkTitleDifferent() || idsDifferent;
    }

    const checkCategoryDifferent = () => {
        const originalCategory = context.data.original.relationships.category?.id;
        const editingCategory = context.data.editing.relationships.category?.id;
        return originalCategory !== editingCategory;
    }

    if (context.type === "recording") {
        const audioDifferent = (() => {
            const originalMod = context.data.original.data.audio.attributes.timestamps.modified;
            const editingMod = context.data.editing.data.audio.attributes.timestamps.modified;
            return originalMod !== editingMod;
        })();

        return checkTitleDifferent() || checkCategoryDifferent() || audioDifferent;
    }

    if (context.type === "note") {
        const textDifferent = (() => {
            const originalText = context.data.original.data.content;
            const editingText = context.data.editing.data.content;
            return originalText !== editingText;
        })();

        return checkTitleDifferent() || checkCategoryDifferent() || textDifferent;
    }

    return false;
}, canSave => canSave);

/* 
*   Format the details of the editing model
*/

// Factory

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
    formatByteLength(model.data.audio.data.bytes.length) :
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
            return createRecodingDetails(context.data.editing);
        case "note":
            return createNoteDetails(context.data.editing);
        case "category":
            return createWrappedDetails(context.data.editing);
        default:
            return []
    }
}, details => details);
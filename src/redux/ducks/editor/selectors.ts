import { createSelector } from "reselect";

import { RootState } from "../../store";

const stringArraysEqual = (arr1: string[], arr2: string[]) => {
    const asSet = new Set([...arr1, ...arr2]);
    return asSet.size === arr1.length && asSet.size === arr2.length;
}

export const getSaveAvailability = createSelector((state: RootState) => {
    const { attributes, context } = state.editor;

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
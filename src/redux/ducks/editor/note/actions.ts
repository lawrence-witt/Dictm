import * as types from './types';

import { NoteModel } from '../../../_data/notesData';

export const updateNoteEditorTitle = (
    title: string
): types.NoteEditorTitleUpdatedAction => ({
    type: types.NOTE_EDITOR_TITLE_UPDATED,
    payload: {
        title
    }
});

export const updateNoteEditorCategory = (
    id?: string
): types.NoteEditorCategoryUpdatedAction => ({
    type: types.NOTE_EDITOR_CATEGORY_UPDATED,
    payload: {
        id
    }
});

export const updateNoteEditorData = (
    data: NoteModel["data"]
): types.NoteEditorDataUpdatedAction => ({
    type: types.NOTE_EDITOR_DATA_UPDATED,
    payload: {
        data
    }
});
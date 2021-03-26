import { RecordingModel } from '../../_data/recordingsData';
import { NoteModel } from '../../_data/notesData';
import { CategoryModel } from '../../_data/categoriesData';

/* 
*   ACTIONS
*/

// Action Constants

export const EDITOR_OPENED                      = "dictm/editor/EDITOR_OPENED";
export const EDITOR_CLOSED                      = "dictm/editor/EDITOR_CLOSED";
export const EDITOR_CLEARED                     = "dictm/editor/EDITOR_CLEARED";

export const RECORDING_EDITOR_MODE_UPDATED      = "dictm/editor/recording/MODE_UPDATED";
export const RECORDING_EDITOR_TITLE_UPDATED     = "dictm/editor/recording/TITLE_UPDATED";
export const RECORDING_EDITOR_CATEGORY_UPDATED  = "dictm/editor/recording/CATEGORY_UPDATED";
export const RECORDING_EDITOR_DATA_UPDATED      = "dictm/editor/recording/DATA_UPDATED";

export const NOTE_EDITOR_TITLE_UPDATED          = "dictm/editor/note/TITLE_UPDATED";
export const NOTE_EDITOR_CATEGORY_UPDATED       = "dictm/editor/note/CATEGORY_UPDATED";
export const NOTE_EDITOR_DATA_UPDATED           = "dictm/editor/note/DATA_UPDATED";

export const CATEGORY_EDITOR_TITLE_UPDATED      = "dictm/editor/category/TITLE_UPDATED";
export const CATEGORY_EDITOR_IDS_UPDATED        = "dictm/editor/category/IDS_UPDATED";

// Recording Context Action Types

export interface RecordingEditorModeUpdatedAction {
    type: typeof RECORDING_EDITOR_MODE_UPDATED;
    payload: {
        mode: "edit" | "play";
    }
}

export interface RecordingEditorTitleUpdatedAction {
    type: typeof RECORDING_EDITOR_TITLE_UPDATED;
    payload: {
        title: string;
    }
}

export interface RecordingEditorCategoryUpdatedAction {
    type: typeof RECORDING_EDITOR_CATEGORY_UPDATED;
    payload: {
        id?: string;
    }
}

export interface RecordingEditorDataUpdatedAction {
    type: typeof RECORDING_EDITOR_DATA_UPDATED;
    payload: {
        data: RecordingModel["data"];
    }
}

// Note Context Action Types

export interface NoteEditorTitleUpdatedAction {
    type: typeof NOTE_EDITOR_TITLE_UPDATED;
    payload: {
        title: string;
    }
}

export interface NoteEditorCategoryUpdatedAction {
    type: typeof NOTE_EDITOR_CATEGORY_UPDATED;
    payload: {
        id?: string;
    }
}

export interface NoteEditorDataUpdatedAction {
    type: typeof NOTE_EDITOR_DATA_UPDATED;
    payload: {
        data: NoteModel["data"];
    }
}

// Category Context Action Types

export interface CategoryEditorTitleUpdatedAction {
    type: typeof CATEGORY_EDITOR_TITLE_UPDATED;
    payload: {
        title: string;
    }
}

export interface CategoryEditorIdsUpdatedAction {
    type: typeof CATEGORY_EDITOR_IDS_UPDATED;
    payload: {
        type: "recordings" | "notes";
        ids: string[];
    }
}

// Editor Action Types

export interface EditorOpenedAction {
    type: typeof EDITOR_OPENED;
    payload: {
        title: string;
        isNew: boolean;
        context: EditorContexts[keyof EditorContexts];
    }
}

export interface EditorClosedAction {
    type: typeof EDITOR_CLOSED;
}

export interface EditorClearedAction {
    type: typeof EDITOR_CLEARED;
}

// Unionised Action Types

export type RecordingEditorActionTypes =
    EditorOpenedAction |
    RecordingEditorModeUpdatedAction |
    RecordingEditorTitleUpdatedAction |
    RecordingEditorCategoryUpdatedAction |
    RecordingEditorDataUpdatedAction;

export type NoteEditorActionTypes =
    EditorOpenedAction |
    NoteEditorTitleUpdatedAction |
    NoteEditorCategoryUpdatedAction |
    NoteEditorDataUpdatedAction;

export type CategoryEditorActionTypes =
    EditorOpenedAction |
    CategoryEditorTitleUpdatedAction |
    CategoryEditorIdsUpdatedAction;

export type EditorActionTypes =
    RecordingEditorActionTypes |
    NoteEditorActionTypes |
    CategoryEditorActionTypes |
    EditorClosedAction |
    EditorClearedAction;

/* 
*   STATES
*/

// Unionised Model Types

export type ContentModelTypes = "recording" | "note" | "category";
export type ContentModels = RecordingModel | NoteModel | CategoryModel;

export type EditorModelTypes = "choose" | ContentModelTypes;
export type EditorModels = { type: "choose" } | ContentModels;

// Context Reducers

interface EditorContext<Model extends ContentModels> {
    type: Model["type"];
    data: {
        original: Model;
        editing: Model;
    }
}

export interface ChooseEditorContext {
    type: "choose";
}

export interface RecordingEditorContext extends EditorContext<RecordingModel> {
    mode: "edit" | "play";
}

export type NoteEditorContext = EditorContext<NoteModel>;

export type CategoryEditorContext = EditorContext<CategoryModel>;

export type EditorContexts = {
    choose: ChooseEditorContext;
    recording: RecordingEditorContext;
    note: NoteEditorContext;
    category: CategoryEditorContext;
};

// Editor Reducer

type Dialog<K extends string> = {
    [key in K]: {
        isOpen: boolean;
    }
}

export interface EditorState {
    attributes: {
        title: string;
        isOpen: boolean;
        isNew: boolean;
    };
    context?: EditorContexts[keyof EditorContexts];
    dialogs: Dialog<"save"> & Dialog<"details">;
}
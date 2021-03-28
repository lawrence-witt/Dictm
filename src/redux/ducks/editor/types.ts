import { RecordingModel } from '../../_data/recordingsData';
import { NoteModel } from '../../_data/notesData';
import { CategoryModel } from '../../_data/categoriesData';

import { recordingTypes } from './recording';
import { noteTypes } from './note';
import { categoryTypes } from './category';

/* 
*   Contexts
*/

export interface EditorContext<Model extends ContentModels> {
    type: Model["type"];
    data: {
        original: Model;
        editing: Model;
    }
}

export interface ChooseEditorContext {
    type: "choose";
}

export type EditorContexts = {
    choose: ChooseEditorContext;
    recording: recordingTypes.RecordingEditorContext;
    note: noteTypes.NoteEditorContext;
    category: categoryTypes.CategoryEditorContext;
};

/* 
*   Actions
*/

export const EDITOR_OPENED                      = "dictm/editor/EDITOR_OPENED";
export const EDITOR_SET_SAVING                  = "dictm/editor/EDITOR_SET_SAVING";
export const EDITOR_UNSET_SAVING                = "dictm/editor/EDITOR_UNSET_SAVING";
export const EDITOR_CLOSED                      = "dictm/editor/EDITOR_CLOSED";
export const EDITOR_CLEARED                     = "dictm/editor/EDITOR_CLEARED";

export interface EditorOpenedAction {
    type: typeof EDITOR_OPENED;
    payload: {
        title: string;
        isNew: boolean;
        context: EditorContexts[keyof EditorContexts];
    }
}

export interface EditorSetSavingAction {
    type: typeof EDITOR_SET_SAVING;
}

export interface EditorUnsetSavingAction {
    type: typeof EDITOR_UNSET_SAVING;
}

export interface EditorClosedAction {
    type: typeof EDITOR_CLOSED;
}

export interface EditorClearedAction {
    type: typeof EDITOR_CLEARED;
}

export type EditorActionTypes =
    recordingTypes.RecordingEditorActionTypes |
    noteTypes.NoteEditorActionTypes |
    categoryTypes.CategoryEditorActionTypes |
    EditorSetSavingAction |
    EditorUnsetSavingAction |
    EditorClosedAction |
    EditorClearedAction;

/* 
*   States
*/

// Unionised Model Types

export type ContentModelTypes = "recording" | "note" | "category";
export type ContentModels = RecordingModel | NoteModel | CategoryModel;

export type EditorModelTypes = "choose" | ContentModelTypes;
export type EditorModels = { type: "choose" } | ContentModels;

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
        isSaving: boolean;
    };
    context?: EditorContexts[keyof EditorContexts];
    dialogs: Dialog<"save"> & Dialog<"details">;
}
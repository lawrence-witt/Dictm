import Recording from '../../../db/models/Recording';
import Note from '../../../db/models/Note';
import Category from '../../../db/models/Category';

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

export const EDITOR_OPENED                      = "dictm/editor/OPENED";
export const EDITOR_SET_SAVING                  = "dictm/editor/SET_SAVING";
export const EDITOR_UNSET_SAVING                = "dictm/editor/UNSET_SAVING";
export const EDITOR_SAVE_DIALOG_OPENED          = "dictm/editor/SAVE_DIALOG_OPENED";
export const EDITOR_DETAILS_DIALOG_OPENED       = "dictm/editor/DETAILS_DIALOG_OPENED";
export const EDITOR_DIALOG_CLOSED               = "dictm/editor/DIALOG_CLOSED";
export const EDITOR_CLOSED                      = "dictm/editor/CLOSED";
export const EDITOR_CLEARED                     = "dictm/editor/CLEARED";

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

export interface EditorOpenSaveDialogAction {
    type: typeof EDITOR_SAVE_DIALOG_OPENED;
}

export interface EditorOpenDetailsDialogAction {
    type: typeof EDITOR_DETAILS_DIALOG_OPENED;
}

export interface EditorCloseDialogAction {
    type: typeof EDITOR_DIALOG_CLOSED;
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
    EditorOpenSaveDialogAction |
    EditorOpenDetailsDialogAction |
    EditorCloseDialogAction |
    EditorClosedAction |
    EditorClearedAction;

/* 
*   States
*/

// Unionised Model Types

export type ContentModelTypes = "recording" | "note" | "category";
export type ContentModels = Recording | Note | Category;

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
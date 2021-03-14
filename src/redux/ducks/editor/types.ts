import { RecordingModel } from '../../_data/recordingsData';
import { NoteModel } from '../../_data/notesData';
import { CategoryModel } from '../../_data/categoriesData';

export const EDITOR_OPENED = "dictm/editor/EDITOR_OPENED";
export const EDITOR_CLOSED = "dictm/editor/EDITOR_CLOSED";

export type ContentModelTypes = "recording" | "note" | "category";
export type ContentModels = RecordingModel | NoteModel | CategoryModel;

export type EditorModelTypes = "choose" | ContentModelTypes;
export type EditorModels = { type: "choose" } | ContentModels;

/* 
*   Editor Contexts
*/

type EditorContext<
    Type extends EditorModelTypes, 
    Attributes = void, 
    Data = void, 
    Dialogs = void
> = {
    type: Type;
    attributes: Attributes;
    data: Data;
    dialogs: Dialogs;
};

interface TitleAttribute {
    title: string;
}

interface IsNewAttribute {
    isNew: boolean;
}

interface ModeAttribute {
    mode: "edit" | "play";
}

type Data<M> = {
    original: M;
    edited: M;
}

type Dialog<K extends string> = {
    [key in K]: {
        isOpen: boolean;
    }
}

export type EditorChooseContext = EditorContext<
    "choose", 
    TitleAttribute
>;

export type EditorRecordingContext = EditorContext<
    "recording", 
    TitleAttribute & IsNewAttribute & ModeAttribute,
    Data<RecordingModel>,
    Dialog<"save"> & Dialog<"details">
>;

export type EditorNoteContext = EditorContext<
    "note",
    TitleAttribute & IsNewAttribute,
    Data<NoteModel>,
    Dialog<"save">
>;

export type EditorCategoryContext = EditorContext<
    "category",
    TitleAttribute & IsNewAttribute,
    Data<CategoryModel>,
    Dialog<"save">
>;

export interface EditorContexts {
    choose: EditorChooseContext;
    recording: EditorRecordingContext;
    note: EditorNoteContext;
    category: EditorCategoryContext;
}

/* 
*   Reducer Types
*/

export interface EditorState {
    isOpen: boolean;
    context?: EditorContexts[keyof EditorContexts];
}

export interface EditorOpenedAction {
    type: typeof EDITOR_OPENED;
    payload: {
        context: EditorContexts[keyof EditorContexts];
    }
}

export interface EditorClosedAction {
    type: typeof EDITOR_CLOSED;
}

export type EditorActionTypes = 
    EditorOpenedAction |
    EditorClosedAction;
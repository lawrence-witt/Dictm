import CategoryPanel, { CategoryBarButtons } from './Panels/CategoryPanel';
import ChoosePanel from './Panels/ChoosePanel';
import NotePanel, { NoteBarButtons } from './Panels/NotePanel';
import RecordingPanel, { RecordingBarButtons } from './Panels/Recording/RecordingPanel';

type EditorTypes = 'choose' | 'recording' | 'note' | 'category';

type EditorContentClasses = 
    'categoryEditorContent' | 
    'noteEditorContent' |
    'recordingEditorContent'
;

export interface EditorPanel {
    type: EditorTypes;
    title: string;
    disableGutters: boolean;
    component: string;
    className?: EditorContentClasses;
    Buttons?: React.FC<any>,
    Content: React.FC<any>
}

export const Panels: Record<string, EditorPanel> = {
    choose: {
        type: 'choose',
        title: "Choose New Content",
        disableGutters: true,
        component: "ul",
        Content: ChoosePanel
    },
    category: {
        type: 'category',
        title: "New Category",
        disableGutters: false,
        component: "form",
        className: "categoryEditorContent",
        Buttons: CategoryBarButtons,
        Content: CategoryPanel
    },
    note: {
        type: 'note',
        title: "New Note",
        disableGutters: false,
        component: "div",
        className: "noteEditorContent",
        Buttons: NoteBarButtons,
        Content: NotePanel
    },
    recording: {
        type: 'recording',
        title: "New Recording",
        disableGutters: true,
        component: "div",
        className: "recordingEditorContent",
        Buttons: RecordingBarButtons,
        Content: RecordingPanel
    }
};
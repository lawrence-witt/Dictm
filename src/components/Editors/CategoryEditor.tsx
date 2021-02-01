import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import EditorDrawer, { EditorDrawerBar, EditorDrawerContent } from '../Drawers/EditorDrawer';
import MediaAutocomplete, { MediaOptionProps } from '../Inputs/MediaAutocomplete';

/* CATEGORY FORM */

const recOptions: MediaOptionProps[] = [
    {title: 'My Rec', isSelected: false, assignedCategory: 'A really long category name of Guitar Recordings'},
    {title: 'My Other Rec', isSelected: false}
]

const noteOptions: MediaOptionProps[] = [
    {title: 'My Note', isSelected: false, assignedCategory: 'Presentation'},
    {title: 'My Other Note', isSelected: false}
];

const CategoryForm: React.FC = () => {
    const [recState, setRecState] = React.useState(recOptions);
    const [noteState, setNoteState] = React.useState(noteOptions);

    const updateSelection = React.useCallback((type: string, newSelected: MediaOptionProps[]) => {
        const update = (prevState: MediaOptionProps[], newSelected: MediaOptionProps[]) => ( 
            prevState.map(option => ({
                ...option, 
                isSelected: newSelected.some(newOpt => newOpt.title === option.title)
            }))
        );

        if (type === 'rec') {
            setRecState(s => update(s, newSelected));
        } else if (type === 'note') {
            setNoteState(s => update(s, newSelected));
        }
    }, []);

    return (
        <>
            <TextField label="Title" fullWidth/>
            <MediaAutocomplete options={recState} label={'Recordings'} type="rec" onChange={updateSelection}/>
            <MediaAutocomplete options={noteState} label={'Notes'} type="note" onChange={updateSelection} />
        </>
    );
};

/* CATEGORY EDITOR */

const useCategoryEditorStyles = makeStyles(theme => ({
    categoryDrawerContent: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(3)
        }
    }
}));

const CategoryEditor: React.FC = () => {
    const classes = useCategoryEditorStyles();

    return (
        <EditorDrawer>
            <EditorDrawerBar title={'New Category'}>
                <IconButton>
                    <SaveIcon />
                </IconButton>
            </EditorDrawerBar>
            <EditorDrawerContent className={classes.categoryDrawerContent}>
                <CategoryForm />
            </EditorDrawerContent>
        </EditorDrawer>
    )
};

export default CategoryEditor;
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import CustomSelect from '../../Inputs/CustomSelect';

/* NOTE BUTTONS */

const NoteBarButtons: React.FC = () => {
    return (
        <>
            <IconButton 
                color="inherit"
                edge="end"
            >
                <SaveIcon />
            </IconButton>
        </>
    )
};

/* NOTE EDITOR */

const categories = [
    {id: 1, title: 'My Category'},
    {id: 2, title: 'My Other Category'}
];

const useTextAreaStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        flex: 1,
        cursor: 'text',

        "& .MuiInputBase-root": {
            marginTop: '0px'
        },

        "& .MuiInputLabel-formControl": {
            top: -theme.spacing(2)
        }
    }
}))

const NoteEditor: React.FC = () => {
    const textAreaClasses = useTextAreaStyles();
    const textAreaRef = React.useRef<HTMLInputElement>(null);

    return (
        <>
            <TextField 
                label="Title" 
                fullWidth
            />
            <CustomSelect label="Category" options={categories}/>
            <TextField 
                inputRef={textAreaRef}
                label="Note" 
                multiline 
                fullWidth 
                classes={textAreaClasses}
                InputProps={{disableUnderline: true}}
                onClick={() => textAreaRef.current.focus()}
            />
        </>
    )
};

/* EXPORTS */

export { NoteBarButtons };
export default NoteEditor;
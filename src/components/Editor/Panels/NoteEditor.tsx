import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

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
]

const useSelectStyles = makeStyles(() => ({
    select: {
        "&:focus": {
            background: 'transparent'
        }
    }
}));

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
    const selectClasses = useSelectStyles();
    const textAreaClasses = useTextAreaStyles();

    const textAreaRef = React.useRef<HTMLInputElement>(null);

    return (
        <>
            <TextField 
                label="Title" 
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="category-select">
                    Category
                </InputLabel>
                <Select 
                    labelId="category-select" 
                    value="" 
                    classes={selectClasses}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
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
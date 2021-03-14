import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import CustomSelect from '../../../../atoms/Inputs/CustomSelect';

import { NotePanelProps } from './NotePanel.types';

/* NOTE BAR BUTTONS */

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
}));

const NotePanel: React.FC<NotePanelProps> = (props) => {
    const {
        model
    } = props;

    const textAreaClasses = useTextAreaStyles();
    const textAreaRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

    return (
        <>
            <TextField
                label="Title"
                value={model.attributes.title} 
                fullWidth
            />
            <CustomSelect 
                label="Category"
                options={categories}
            />
            <TextField 
                inputRef={textAreaRef}
                label="Note"
                value={model.data.content}
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
export default NotePanel;
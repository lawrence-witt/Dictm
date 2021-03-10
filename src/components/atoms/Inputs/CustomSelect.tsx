import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

interface CustomSelectProps {
    label: string;
    options: {id: number | string, title: string}[];
}

const useSelectStyles = makeStyles(() => ({
    select: {
        "&:focus": {
            background: 'transparent'
        }
    }
}));

const CustomSelect: React.FC<CustomSelectProps> = (props) => {
    const {
        label,
        options
    } = props;

    const classes = useSelectStyles();

    return (
        <FormControl fullWidth>
            <InputLabel id="custom-select">
                {label}
            </InputLabel>
            <Select 
                labelId="custom-select" 
                value=""
                classes={classes}
            >
                {options.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default CustomSelect;
import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

interface CustomSelectProps {
    label: string;
    selected: string | undefined;
    options: {id: number | string, title: string}[];
    disabled?: boolean;
    fullWidth?: boolean;
    required?: boolean;
    onChange: (id: string | undefined) => void;
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
        selected,
        options,
        disabled,
        fullWidth,
        required,
        onChange
    } = props;

    const classes = useSelectStyles();

    const onOptionChange = React.useCallback((ev: React.ChangeEvent<{value: unknown}>) => {
        onChange(ev.target.value as string);
    }, [onChange]);

    return (
        <FormControl disabled={disabled} fullWidth={fullWidth} required={required}>
            <InputLabel id="custom-select">
                {label}
            </InputLabel>
            <Select
                labelId="custom-select"
                value={selected || ""}
                classes={classes}
                onChange={onOptionChange}
            >
                {!required && <MenuItem value={undefined}><em>None</em></MenuItem>}
                {options.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default CustomSelect;
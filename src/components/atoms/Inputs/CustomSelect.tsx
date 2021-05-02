import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

interface CustomSelectOption {
    id: number | string;
    title: string
}

interface CustomSelectProps<O extends CustomSelectOption[], R extends boolean> {
    label: string;
    selected: string | undefined;
    options: O;
    disabled?: boolean;
    fullWidth?: boolean;
    required?: R;
    onChange: (id: O[number]["id"] | (R extends false | undefined ? undefined : never)) => void;
}

const useSelectStyles = makeStyles(() => ({
    select: {
        "&:focus": {
            background: 'transparent'
        }
    }
}));

const CustomSelect = <O extends CustomSelectOption[], R extends boolean>(
    props: React.PropsWithChildren<CustomSelectProps<O, R>>
): JSX.Element => {
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
        const { value } = ev.target;
        if (typeof value === "string" || typeof value === "number" || typeof value === "undefined") {
            onChange(value as Parameters<typeof onChange>[0]);
        }
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
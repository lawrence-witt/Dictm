import React from 'react';
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CategoryIcon from '@material-ui/icons/Category';
import { makeStyles } from '@material-ui/core/styles';

import PrimaryCheckBox from './PrimaryCheckbox';

/* TYPES */

export interface MediaOptionProps {
    title: string;
    isSelected: boolean;
    assignedCategory?: string;
}

interface MediaAutocompleteProps {
    options: MediaOptionProps[];
    label: string;
    type: string;
    onChange: (type: string, newSelected: MediaOptionProps[]) => void;
}

/* MEDIA OPTION */

const useOptionStyles = makeStyles(theme => ({
    option: {
        display: 'flex',
        width: '100%',
        alignItems: 'center'
    },
    grow: {
        flex: 1
    },
    control: {
        marginRight: theme.spacing(1)
    },
    icon: {
        color: theme.palette.action.active
    }
}));

const MediaOption: React.FC<MediaOptionProps> = (props) => {
    const {
        title = "",
        isSelected = false,
        assignedCategory = undefined
    } = props;

    const classes = useOptionStyles();

    return (
        <div className={classes.option}>
            <PrimaryCheckBox checked={isSelected} className={classes.control} edge="start"/>
            <Typography>{title}</Typography>
            <div className={classes.grow}></div>
            {assignedCategory && (
                <Tooltip title={`Currently assigned to ${assignedCategory}`} arrow>
                    <CategoryIcon className={classes.icon}/>
                </Tooltip>
            )}
        </div>
    )
};

/* MEDIA AUTOCOMPLETE */

const useAutocompleteStyles = makeStyles(theme => ({
    tag: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}))

const MediaAutocomplete: React.FC<MediaAutocompleteProps> = (props) => {
    const {
        options,
        label,
        type,
        onChange
    } = props;

    const classes = useAutocompleteStyles();

    return (
        <Autocomplete
            classes={classes}
            multiple
            options={options}
            value={options.filter(opt => opt.isSelected)}
            getOptionLabel={option => option.title}
            disableCloseOnSelect
            onChange={(event, value: MediaOptionProps[]) => onChange(type, value)}
            renderOption={(option) => (
                <MediaOption 
                    title={option.title} 
                    isSelected={option.isSelected}
                    assignedCategory={option.assignedCategory}
                />
            )}
            renderInput={params => (
                <TextField {...params} label={label}/>
            )}
        />
    )
};

export default MediaAutocomplete;
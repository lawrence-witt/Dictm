import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import CategoryIcon from '@material-ui/icons/Category';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

import EditorDrawer, { EditorDrawerBar, EditorDrawerContent } from '../Drawers/EditorDrawer';
import PrimaryCheckbox from '../Inputs/PrimaryCheckbox';

/* TYPES */

interface MediaOptionProps {
    title: string;
    isSelected: boolean;
    isAssigned: boolean;
}

interface MediaSelectProps {
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
        isAssigned = false,
        isSelected = false
    } = props;

    const classes = useOptionStyles();

    return (
        <div className={classes.option}>
            <FormControlLabel
                control={
                    <PrimaryCheckbox
                        checked={isSelected}
                        className={classes.control}
                    />
                } 
                label={title} 
            />
            <div className={classes.grow}></div>
            {isAssigned && <CategoryIcon className={classes.icon}/>}
        </div>
    )
}

/* MEDIA SELECT */

const MediaSelect: React.FC<MediaSelectProps> = (props) => {
    const {
        options,
        label,
        type,
        onChange
    } = props;

    return (
        <Autocomplete
            multiple
            options={options}
            value={options.filter(opt => opt.isSelected)}
            getOptionLabel={option => option.title}
            disableCloseOnSelect
            onChange={(event, value: MediaOptionProps[]) => onChange(type, value)}
            renderOption={(option) => (
                <>
                <MediaOption 
                    title={option.title} 
                    isSelected={option.isSelected}
                    isAssigned={option.isAssigned}
                />
                </>
            )}
            renderInput={params => (
                <TextField {...params} label={label}/>
            )}
        />
    )
};

/* CATEGORY FORM */

const recOptions = [
    {title: 'My Rec', isSelected: false, isAssigned: true},
    {title: 'My Other Rec', isSelected: false, isAssigned: false}
]

const noteOptions = [
    {title: 'My Note', isSelected: false, isAssigned: true},
    {title: 'My Other Note', isSelected: false, isAssigned: false}
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
            <MediaSelect options={recState} label={'Recordings'} type="rec" onChange={updateSelection}/>
            <MediaSelect options={noteState} label={'Notes'} type="note" onChange={updateSelection} />
        </>
    );
};

/* CATEGORY EDITOR */

const CategoryEditor: React.FC = () => {
    return (
        <EditorDrawer>
            <EditorDrawerBar title={'New Category'}>
                <IconButton>
                    <SaveIcon />
                </IconButton>
            </EditorDrawerBar>
            <EditorDrawerContent>
                <CategoryForm />
            </EditorDrawerContent>
        </EditorDrawer>
    )
};

export default CategoryEditor;
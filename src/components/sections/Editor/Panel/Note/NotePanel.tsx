import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../../../redux/store';
import { categorySelectors } from '../../../../../redux/ducks/categories';
import { noteEditorOperations } from '../../../../../redux/ducks/editor/note';

import CustomSelect from '../../../../atoms/Inputs/CustomSelect';

import { NotePanelProps } from './NotePanel.types';

/* Redux */

const mapState = (state: RootState) => ({
    categoryTitles: categorySelectors.getCategoriesByTitle(state.categories)
});

const mapDispatch = {
    updateTitle: noteEditorOperations.updateNoteEditorTitle,
    updateCategory: noteEditorOperations.updateNoteEditorCategory,
    updateData: noteEditorOperations.updateNoteEditorData
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* Local */

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

const NotePanel: React.FC<NotePanelProps & ReduxProps> = (props) => {
    const {
        model,
        categoryTitles,
        updateTitle,
        updateCategory,
        updateData
    } = props;

    const textAreaClasses = useTextAreaStyles();
    const textAreaRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

    const onTitleChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        updateTitle(ev.target.value);
    }, [updateTitle]);

    const onCategoryChange = React.useCallback((id: string | undefined) => {
        updateCategory(id);
    }, [updateCategory]);

    const onTextChange = React.useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateData(ev.target.value);
    }, [updateData]);

    return (
        <>
            <TextField
                label="Title"
                value={model.attributes.title} 
                fullWidth
                onChange={onTitleChange}
            />
            <CustomSelect 
                label="Category"
                selected={model.relationships.category?.id}
                options={categoryTitles}
                onChange={onCategoryChange}
            />
            <TextField
                inputRef={textAreaRef}
                label="Note"
                value={model.data.content}
                multiline 
                fullWidth 
                classes={textAreaClasses}
                InputProps={{disableUnderline: true}}
                onChange={onTextChange}
                onClick={() => textAreaRef.current.focus()}
            />
        </>
    )
};

export default connector(NotePanel);
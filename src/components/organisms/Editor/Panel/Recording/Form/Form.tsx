import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../../redux/store';
import { categorySelectors } from '../../../../../../redux/ducks/content/categories';
import { recordingEditorOperations } from '../../../../../../redux/ducks/editor/recording';

import { FormProps } from './Form.types';

import CustomSelect from '../../../../../atoms/Inputs/CustomSelect';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    categoryTitles: categorySelectors.getCategoriesByTitle(state.content.categories)
});

const mapDispatch = {
    updateTitle: recordingEditorOperations.updateRecordingEditorTitle,
    updateCategory: recordingEditorOperations.updateRecordingEditorCategory,
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(theme => ({
    form: {
        margin: `0px ${theme.spacing(3)}px`
    },
    textField: {
        marginBottom: theme.spacing(2)
    }
}));

const Form: React.FC<FormProps & ReduxProps> = (props) => {
    const {
        title,
        category,
        flags,
        categoryTitles,
        updateTitle,
        updateCategory
    } = props;

    const classes = useStyles();

    const onTitleChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        updateTitle(ev.target.value);
    }, [updateTitle]);

    const onCategoryChange = React.useCallback((id: string | undefined) => {
        updateCategory(id);
    }, [updateCategory]);

    return flags.hasData ? (
        <form className={classes.form}>
            <TextField 
                label="Title"
                value={title}
                fullWidth
                required
                className={classes.textField}
                onChange={onTitleChange}
            />
            <CustomSelect 
                label="Category"
                fullWidth
                selected={category}
                options={categoryTitles}
                onChange={onCategoryChange}
            />
        </form>
    ) : null;
};

export default connector(Form);
import React from 'react';
import TextField from '@material-ui/core/TextField';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorOperations } from '../../../../../redux/ducks/editor';
import { mediaSelectors } from '../../../../../redux/ducks/media';

import MediaAutocomplete, { MediaOption } from '../../../../atoms/Inputs/MediaAutocomplete';

import { CategoryPanelProps } from './CategoryPanel.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    recordingOptions: mediaSelectors.getMediaByTitleAndCategory(state, "recordings"),
    noteOptions: mediaSelectors.getMediaByTitleAndCategory(state, "notes")
});

const mapDispatch = {
    updateTitle: editorOperations.updateCategoryEditorTitle,
    updateIds: editorOperations.updateCategoryEditorIds
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoryPanel: React.FC<CategoryPanelProps & ReduxProps> = (props) => {
    const {
        model,
        recordingOptions,
        noteOptions,
        updateTitle,
        updateIds
    } = props;

    const onTitleChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        updateTitle(ev.target.value);
    }, [updateTitle])

    const onAutocompleteChange = React.useCallback((type: "recordings" | "notes", newSelected: MediaOption[]) => {
        updateIds(type, newSelected.map(option => option.id));
    }, [updateIds]);

    return (
        <>
            <TextField 
                label="Title"
                value={model.attributes.title} 
                fullWidth
                onChange={onTitleChange}
            />
            <MediaAutocomplete
                options={recordingOptions}
                values={model.relationships.recordings.ids} 
                label='Recordings'
                onChange={(newSelected) => onAutocompleteChange("recordings", newSelected)}
            />
            <MediaAutocomplete 
                options={noteOptions}
                values={model.relationships.notes.ids}
                label='Notes'
                onChange={(newSelected) => onAutocompleteChange("notes", newSelected)} 
            />
        </>
    );
};

export default connector(CategoryPanel);
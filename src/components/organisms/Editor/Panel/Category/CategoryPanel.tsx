import React from 'react';
import TextField from '@material-ui/core/TextField';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { categoryEditorOperations } from '../../../../../redux/ducks/editor/category';
import { contentSelectors } from '../../../../../redux/ducks/content';

import MediaAutocomplete, { MediaOption } from '../../../../atoms/Inputs/MediaAutocomplete';

import { CategoryPanelProps } from './CategoryPanel.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    recordingOptions: contentSelectors.getMediaByTitleAndCategory(state.content, "recordings"),
    noteOptions: contentSelectors.getMediaByTitleAndCategory(state.content, "notes")
});

const mapDispatch = {
    updateTitle: categoryEditorOperations.updateCategoryEditorTitle,
    updateIds: categoryEditorOperations.updateCategoryEditorIds
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
    }, [updateTitle]);

    const onRecordingsIdsChange = React.useCallback((newSelected: MediaOption[]) => {
        updateIds("recordings", newSelected.map(option => option.id));
    }, [updateIds]);

    const onNotesIdsChange = React.useCallback((newSelected: MediaOption[]) => {
        updateIds("notes", newSelected.map(option => option.id));
    }, [updateIds]);

    return (
        <>
            <TextField 
                label="Title"
                value={model.attributes.title}
                required
                fullWidth
                onChange={onTitleChange}
            />
            <MediaAutocomplete
                options={recordingOptions}
                values={model.relationships.recordings.ids} 
                label='Recordings'
                onChange={onRecordingsIdsChange}
            />
            <MediaAutocomplete 
                options={noteOptions}
                values={model.relationships.notes.ids}
                label='Notes'
                onChange={onNotesIdsChange} 
            />
        </>
    );
};

export default connector(CategoryPanel);
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { userOperations } from '../../../../../../redux/ducks/user';

import Typography from '@material-ui/core/Typography';

import Section from '../../../../../molecules/Section/Section';
import CustomSelect from '../../../../../atoms/Inputs/CustomSelect';

import * as types from './DisplaySettings.types';

/* 
*   Redux
*/

const mapDispatch = {
    updateDisplaySort: userOperations.updateUserDisplaySort
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const DisplaySettings: React.FC<types.DisplaySettingsProps & ReduxProps> = (props) => {
    const {
        baseClasses,
        sortClasses,
        sortOrders,
        updateDisplaySort
    } = props;

    const handleChangeResourceOrder = React.useCallback((type: types.ViewKeys, id: types.SortOrderKeys) => {
        updateDisplaySort(type, id);
    }, [updateDisplaySort]);

    const handleChangeRecordingsOrder = React.useCallback((id: types.SortOrderKeys) => {
        handleChangeResourceOrder("recordings", id);
    }, [handleChangeResourceOrder]);
    
    const handleChangeNotesOrder = React.useCallback((id: types.SortOrderKeys) => {
        handleChangeResourceOrder("notes", id);
    }, [handleChangeResourceOrder]);

    const handleChangeCategoriesOrder = React.useCallback((id: types.SortOrderKeys) => {
        handleChangeResourceOrder("categories", id);
    }, [handleChangeResourceOrder]);

    const handleChangeMixedOrder = React.useCallback((id: types.SortOrderKeys) => {
        handleChangeResourceOrder("mixed", id);
    }, [handleChangeResourceOrder]);

    return (
        <Section
            title="Display"
            classes={baseClasses}
        >
            <Section
                title="Sort Order"
                headerVariant="h6"
                classes={sortClasses}
            >
                <Typography>
                    Choose how you would like resources to be sorted in the card view.
                </Typography>
                <CustomSelect
                    fullWidth
                    label="Recordings"
                    required
                    selected={sortOrders.recordings}
                    options={types.orderOptions}
                    onChange={handleChangeRecordingsOrder}
                />
                <CustomSelect
                    fullWidth
                    label="Notes"
                    required
                    selected={sortOrders.notes}
                    options={types.orderOptions}
                    onChange={handleChangeNotesOrder}
                />
                <CustomSelect
                    fullWidth
                    label="Categories"
                    required
                    selected={sortOrders.categories}
                    options={types.orderOptions}
                    onChange={handleChangeCategoriesOrder}
                />
                <CustomSelect
                    fullWidth
                    label="Mixed Category"
                    required
                    selected={sortOrders.mixed}
                    options={types.orderOptions}
                    onChange={handleChangeMixedOrder}
                />
            </Section>
        </Section>
    )
}

export default connector(DisplaySettings);
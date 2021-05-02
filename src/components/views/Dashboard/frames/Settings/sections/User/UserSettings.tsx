import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { userOperations } from '../../../../../../../redux/ducks/user';

import TextField from '@material-ui/core/TextField';

import Section from '../../../../../../molecules/Section/Section';

import useValidatedField from '../../../../../../../lib/hooks/useValidatedField';

import * as types from './UserSettings.types';

/* 
*   Redux
*/

const mapDispatch = {
    updateUserName: userOperations.updateUserName,
    updateUserPreference: userOperations.updateUserPreference
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const isValidName = (value: string) => {
    if (value.length === 0) throw "Name must be at least 1 character"
    return true;
}

const UserSettings: React.FC<types.UserSettingsProps & ReduxProps> = (props) => {
    const {
        baseClasses,
        name,
        greeting,
        updateUserName,
        updateUserPreference
    } = props;

    const onGreetingDebounced = React.useCallback((value: string) => {
        updateUserPreference("greeting", value);
    }, [updateUserPreference]);

    const [nameField, setNameField, nameFieldError] = useValidatedField(
        name, isValidName, updateUserName, 500
    );

    const [greetingField, setGreetingField] = useValidatedField(
        greeting, undefined, onGreetingDebounced, 500
    );

    const handleNameChanged = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setNameField(ev.target.value);
    }, [setNameField]);

    const handleGreetingChanged = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setGreetingField(ev.target.value);
    }, [setGreetingField]);

    return (
        <Section
            title="User"
            classes={baseClasses}
        >
            <TextField
                required
                label="Name"
                name="name"
                fullWidth
                onChange={handleNameChanged}
                value={nameField}
                error={Boolean(nameFieldError)}
                helperText={nameFieldError}
                FormHelperTextProps={{
                    error: true
                }}
            />
            <TextField
                label="Greeting"
                name="greeting"
                value={greetingField}
                fullWidth
                onChange={handleGreetingChanged}
            />
        </Section>
    )
}

export default connector(UserSettings);
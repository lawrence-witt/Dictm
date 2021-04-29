import React from 'react';

import TextField from '@material-ui/core/TextField';

import Section from '../../../../../../molecules/Section/Section';
import { SectionClasses } from '../../../../../../molecules/Section/Section.types';

interface UserSettingsProps {
    baseClasses: SectionClasses;
}

const UserSettings: React.FC<UserSettingsProps> = (props) => {
    const {
        baseClasses
    } = props;

    return (
        <Section
            title="User"
            classes={baseClasses}
        >
            <TextField
                required
                label="Name"
                name="name"
                value={""}
                fullWidth
                onChange={() => ({})}
            />
            <TextField
                label="Greeting"
                name="greeting"
                fullWidth
                onChange={() => ({})}
            />
        </Section>
    )
}

export default UserSettings;
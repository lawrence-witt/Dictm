import React from 'react';

import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Section from '../../../../../../molecules/Section/Section';
import { SectionClasses } from '../../../../../../molecules/Section/Section.types';

interface DataSettingsProps {
    baseClasses: SectionClasses;
    deleteResourcesClasses: SectionClasses;
    deleteUserClasses: SectionClasses;
}

const DataSettings: React.FC<DataSettingsProps> = (props) => {
    const {
        baseClasses,
        deleteResourcesClasses,
        deleteUserClasses
    } = props;

    console.log(deleteResourcesClasses);

    return (
        <Section
            title="Data"
            classes={baseClasses}
        >
            <Section
                title="Delete Resources"
                headerVariant="h6"
                classes={deleteResourcesClasses}
            >
                <Typography>
                    Delete all resources of a particular type from this account.
                </Typography>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                    <Button variant="outlined">Delete Recordings</Button>
                    <Button variant="outlined">Delete Notes</Button>
                    <Button variant="outlined">Delete Categories</Button>
                </div>
            </Section>
            <Section
                title="Delete User"
                headerVariant="h6"
                classes={deleteUserClasses}
            >
                <Typography>
                    Delete this account and all its associated resources.
                </Typography>
                <Button variant="outlined">Delete User</Button>
            </Section>
        </Section>
    )
}

export default DataSettings;
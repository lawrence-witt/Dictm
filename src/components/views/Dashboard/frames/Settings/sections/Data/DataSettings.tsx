import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Section from '../../../../../../molecules/Section/Section';
import { SectionClasses } from '../../../../../../molecules/Section/Section.types';

interface DataSettingsProps {
    baseClasses: SectionClasses;
    deleteResourcesClasses: SectionClasses;
    deleteUserClasses: SectionClasses;
}

const useStyles = makeStyles(theme => ({
    buttonContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        marginLeft: -theme.spacing(2),
        marginBottom: -theme.spacing(1),

        "& button": {
            marginLeft: theme.spacing(2),
            marginBottom: theme.spacing(1)
        }
    }
}))

const DataSettings: React.FC<DataSettingsProps> = (props) => {
    const {
        baseClasses,
        deleteResourcesClasses,
        deleteUserClasses
    } = props;

    const classes = useStyles();

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
                <div className={classes.buttonContainer}>
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
                <div className={classes.buttonContainer}>
                    <Button variant="outlined">Delete User</Button>
                </div>
            </Section>
        </Section>
    )
}

export default DataSettings;
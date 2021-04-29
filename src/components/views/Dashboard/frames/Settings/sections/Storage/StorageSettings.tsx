import React from 'react';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Section from '../../../../../../molecules/Section/Section';
import { SectionClasses } from '../../../../../../molecules/Section/Section.types';

import CustomSelect from '../../../../../../atoms/Inputs/CustomSelect';

interface StorageSettingsProps {
    baseClasses: SectionClasses;
    persistenceClasses: SectionClasses;
    thresholdClasses: SectionClasses;
}

const byteOptions = [
    {id: "Bytes", title: "Bytes"},
    {id: "MB", title: "MB"},
    {id: "GB", title: "GB"}
];

const useStyles = makeStyles(theme => ({
    persistenceButton: {
        alignSelf: 'flex-end',
        marginTop: theme.spacing(1)
    }
}))

const StorageSettings: React.FC<StorageSettingsProps> = (props) => {
    const {
        baseClasses,
        persistenceClasses,
        thresholdClasses
    } = props;

    const classes = useStyles();

    return (
        <Section
            title="Storage"
            classes={baseClasses}
        >
            <Section
                title="Persistence"
                headerVariant="h6"
                classes={persistenceClasses}
            >
                <Typography>
                    In the unlikely event that your browser runs out of storage space, it may delete locally stored resources at random to make room. If you would like to tell the browser not to delete resources owned by this site, click the button below.
                </Typography>
                <Typography>
                    Selecting this option is permanent in current browsers, and will affect all other Dictm accounts on this browser.
                </Typography>
                <Button
                    variant="outlined"
                    className={classes.persistenceButton}
                >
                    Request Persistent Storage
                </Button>
            </Section>
            <Section
                title="Threshold"
                headerVariant="h6"
                classes={thresholdClasses}
            >
                <Typography>
                    Get a notification when the browser&apos;s remaining storage space drops below a certain threshold.
                </Typography>
                <Typography>
                    Available storage space: 1.2GB (approx)
                </Typography>
                {/* Cant have inputs inside p */}
                <Typography>
                    Warn me at:
                    <TextField 
                        required
                        label="Value"
                        type="number"
                        value={500}
                    />
                    <CustomSelect
                        required
                        label="Unit"
                        selected="Bytes"
                        options={byteOptions}
                        onChange={() => ({})}
                    />
                </Typography>
            </Section>
        </Section>
    )
}

export default StorageSettings;
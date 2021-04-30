import React from 'react';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Section from '../../../../../../molecules/Section/Section';
import { SectionClasses } from '../../../../../../molecules/Section/Section.types';
import FlexSpace from '../../../../../../atoms/FlexSpace/FlexSpace';
import CustomSelect from '../../../../../../atoms/Inputs/CustomSelect';

import { formatFileSize } from '../../../../../../../lib/utils/formatFileSize';

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
    },
    warnContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        marginBottom: -theme.spacing(1),
        "& > p": {
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(1)
        }
    },
    warnInputContainer: {
        display: 'flex',
        marginLeft: -theme.spacing(1),
        "& > *": {
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(1),
        }
    }
}));

const storageManagerSupported = (
    navigator.storage &&
    Boolean(navigator.storage.estimate) &&
    Boolean(navigator.storage.persist) &&
    Boolean(navigator.storage.persisted)
);

const StorageSettings: React.FC<StorageSettingsProps> = (props) => {
    const {
        baseClasses,
        persistenceClasses,
        thresholdClasses
    } = props;

    const classes = useStyles();

    const [manager, setManager] = React.useState({
        supported: false,
        persisted: false,
        availableSpace: "Calculating..."
    });

    React.useEffect(() => {
        (async () => {
            const notSupported = () => setManager(m => ({
                ...m,
                availableSpace: "Sorry, StorageManager in not supported in this browser!"
            }))

            if (!storageManagerSupported) { notSupported(); return; }

            const { usage, quota } = await navigator.storage.estimate();
            const persisted = await navigator.storage.persisted();

            if (!usage || !quota) { notSupported(); return; }

            setManager({
                supported: true,
                persisted,
                availableSpace: formatFileSize(quota - usage) + " (approx.)"
            });
        })();
    }, []);

    const handlePersistenceRequest = React.useCallback(async () => {
        if (storageManagerSupported) {
            const persisted = await navigator.storage.persist();
            setManager(m => ({ ...m, persisted }));
        }
    }, []);

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
                    Selecting this option will affect all other Dictm accounts on this browser.
                </Typography>
                <div className={classes.buttonContainer}>
                    <Button 
                        disabled={!manager.supported || manager.persisted}
                        variant="outlined"
                        onClick={handlePersistenceRequest}
                    >
                        {manager.persisted ? 
                            "Persistent Storage Granted" : 
                            "Request Persistent Storage"
                        }
                    </Button>
                </div>
            </Section>
            <Section
                title="Threshold"
                headerVariant="h6"
                classes={thresholdClasses}
            >
                <Typography>
                    Get a notification when the browser&apos;s remaining storage space for this site drops below a certain threshold.
                </Typography>
                <Typography>
                    Available storage space: <b>{manager.availableSpace}</b>
                </Typography>
                <div className={classes.warnContainer}>
                    <Typography>Warn me at:</Typography>
                    <FlexSpace/>
                    <div className={classes.warnInputContainer}>
                        <TextField 
                            disabled={!manager.supported}
                            required
                            label="Value"
                            type="number"
                            value={500}
                        />
                        <CustomSelect
                            disabled={!manager.supported}
                            required
                            label="Unit"
                            selected="Bytes"
                            options={byteOptions}
                            onChange={() => ({})}
                        />
                    </div>
                </div>
            </Section>
        </Section>
    )
}

export default StorageSettings;
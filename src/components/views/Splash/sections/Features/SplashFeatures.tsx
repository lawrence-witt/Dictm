import React from 'react';

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

import Section from '../../../../molecules/Section/Section';

const useStyles = makeStyles(theme => ({
    featuresRoot: {
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(4, 2, 8, 2),
        overflow: 'hidden',
        width: '100%',
        color: theme.palette.getContrastText(theme.palette.primary.main),

        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(4, 4, 8, 4),
        },

        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(6, 6, 8, 6),
        }
    },
    featuresTopSectionHeader: {
        marginBottom: theme.spacing(4)
    },
    featuresTopSectionContent: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(8)
        }
    },
    featuresSubSectionHeader: {
        marginBottom: theme.spacing(4)
    },
    featuresSubSectionContent: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        }
    }
}))

const SplashFeatures: React.FC = () => {
    const classes = useStyles();

    const topSectionClasses = React.useMemo(() => ({
        header: classes.featuresTopSectionHeader,
        content: classes.featuresTopSectionContent
    }), [classes]);

    const subSectionClasses = React.useMemo(() => ({
        header: classes.featuresSubSectionHeader,
        content: classes.featuresSubSectionContent
    }), [classes]);

    return (
        <div className={classes.featuresRoot}>
            <Section
                title="Features"
                headerVariant="h4"
                classes={topSectionClasses}
            >
                <Section
                    title="The sound of success &#127911;"
                    classes={subSectionClasses}
                >
                    <Typography>Capture lossless audio clips in the WAV format using any microphone input.</Typography>
                    <Typography>Overwrite your clips with new audio at any time with the built-in editor.</Typography>
                    <Typography>Use high precision track scrubbing to scan through your audio waveforms.</Typography>
                </Section>
                <Section
                    title="Everything in its right place &#x1F5C3;&#xFE0F;"
                    classes={subSectionClasses}
                >
                    <Typography>Store text notes and lists side by side with your recordings.</Typography>
                    <Typography>Assign custom categories to keep things organised.</Typography>
                    <Typography>Get detailed metadata and usage insights for your files.</Typography>
                </Section>
                <Section
                    title="Make it personal &#x1F3A8;"
                    classes={subSectionClasses}
                >
                    <Typography>Dictm supports all modern browsers, on all platforms - the choice is yours.</Typography>
                    <Typography>Customise your account to display your data the way you want it.</Typography>
                    <Typography>Everyone gets one! Store multiple users in the same browser.</Typography>
                </Section>
            </Section>
        </div>
    )
}

export default SplashFeatures;
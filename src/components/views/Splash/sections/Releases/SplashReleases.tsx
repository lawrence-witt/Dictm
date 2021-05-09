import React from 'react';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import GitHubIcon from '@material-ui/icons/GitHub';
import { makeStyles } from '@material-ui/core/styles';

import Section from '../../../../molecules/Section/Section';
import ReleaseAccordion from '../../../../molecules/ReleaseAccordion/ReleaseAccordion';

const futureReleases = [
    {title: "Theming", desc: "dark mode and custom palettes."},
    {title: "Playlists", desc: "enabling looped file playback in the card view."},
    {title: "Local installation", desc: "save Dictm to your home-screen or desktop."},
    {title: "Account migration", desc: "export an import data a zipped file."},
    {title: "Cloud storage", desc: "private accounts with data synced between devices."},
    {title: "Tooling", desc: "more editing tools for both audio and text content."},
    {title: "Encoding", desc: "MP3 encoding to suppot storage-restricted browsers."}
];

const useStyles = makeStyles(theme => ({
    releasesRoot: {
        padding: theme.spacing(4, 2),
        overflow: 'hidden',
        width: '100%',
        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(4)
        },
        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(6)
        }
    },
    releasesTopSectionHeader: {
        marginBottom: theme.spacing(4)
    },
    releasesTopSectionContent: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginRight: -theme.spacing(4)
    },
    releasesSubSectionRoot: {
        width: '100%',
        paddingRight: theme.spacing(4),
        marginBottom: theme.spacing(8),

        [theme.breakpoints.up("sm")]: {
            flex: "1 1 50%",
            minWidth: 400,
            maxWidth: 600
        }
    },
    releasesSubSectionHeader: {
        marginBottom: theme.spacing(4)
    },
    latestSubSectionContent: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(4)
        }
    },
    futureSubSectionContent: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        }
    },
    divider: {
        height: 2
    },
    gitBanner: {
        paddingTop: theme.spacing(8),
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: theme.spacing(4),

        "& > svg": {
            width: 'clamp(75px, 15vw, 115px)',
            height: 'clamp(75px, 15vw, 115px)'
        },
        "& > div": {
            "& > *:not(:last-child)": {
                marginBottom: theme.spacing(2)
            }
        }
    }
}))

const SplashReleases: React.FC = () => {
    const classes = useStyles();

    const topSectionClasses = React.useMemo(() => ({
        header: classes.releasesTopSectionHeader,
        content: classes.releasesTopSectionContent
    }), [classes]);

    const latestSubSectionClasses = React.useMemo(() => ({
        root: classes.releasesSubSectionRoot,
        header: classes.releasesSubSectionHeader,
        content: classes.latestSubSectionContent
    }), [classes]);

    const futureSubSectionClasses = React.useMemo(() => ({
        root: classes.releasesSubSectionRoot,
        header: classes.releasesSubSectionHeader,
        content: classes.futureSubSectionContent
    }), [classes]);

    return (
        <div className={classes.releasesRoot}>
            <Section
                title="Releases"
                headerVariant="h4"
                classes={topSectionClasses}
            >
                <Section
                    title="Latest - v1.0.0 &#x1F680;"
                    classes={latestSubSectionClasses}
                >
                    <ReleaseAccordion 
                        features={[
                            <Typography key={1}>Everything! Dictm has launched!</Typography>
                        ]}
                        improvements={[]}
                        fixes={[]}
                    />
                    <Typography>View the changelog for details of previous releases.</Typography>
                </Section>
                <Section
                    title="Future &#x1F52E;"
                    classes={futureSubSectionClasses}
                >
                    {futureReleases.map(release => (
                        <Typography 
                            key={release.title}
                        >
                            <b>{release.title}</b>: {release.desc}
                        </Typography>)
                    )}
                </Section>
            </Section>
            <Divider className={classes.divider}/>
            <div className={classes.gitBanner}>
                <GitHubIcon/>
                <div>
                    <Typography variant="h5">Dictm is currently open source.</Typography>
                    <Typography>To view the source code, make feature requests, and report bugs, visit the <Link href="#">GitHub repository</Link>.</Typography>
                </div>
            </div>
        </div>
    );
}

export default SplashReleases;
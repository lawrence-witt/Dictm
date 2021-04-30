import React from 'react';

import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core';

import UserSettings from './sections/User/UserSettings';
import DisplaySettings from './sections/Display/DisplaySettings';
import StorageSettings from './sections/Storage/StorageSettings';
import DataSettings from './sections/Data/DataSettings';

const useStyles = makeStyles(theme => ({
    scrollContainer: {
        overflowY: 'auto',
        height: '100%',
        display: 'flex'
    },
    sectionsContainer: {
        padding: theme.spacing(2),
        maxWidth: 700
    },
    scrollMenu: {
        position: 'sticky',
        top: 0,
        padding: theme.spacing(2, 15, 0, 2),
        height: "100%",
        display: 'flex',
        flexDirection: 'column',

        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 5, 0, 2),
        },

        [theme.breakpoints.down("xs")]: {
            display: "none",
        },

        "& > a": {
            display: 'block',
            cursor: "pointer",
            marginBottom: theme.spacing(1)
        }
    },
    spacer: {
        height: theme.spacing(10)
    },
    singlePadding: {
        paddingBottom: theme.spacing(1)
    },
    doublePadding: {
        paddingBottom: theme.spacing(2)
    },
    sectionContent: {
        "& > *:not(:last-child)": {
            paddingBottom: theme.spacing(1)
        }
    }
}))

const SettingsTemplate: React.FC = () => {
    const classes = useStyles();

    // Classes for the top level Section components

    const userSectionClasses = React.useMemo(() => ({
        header: classes.singlePadding,
        content: classes.sectionContent
    }), [classes]);

    const midSectionClasses = React.useMemo(() => ({
        header: classes.doublePadding
    }), [classes]);

    const bottomSectionClasses = React.useMemo(() => ({
        root: classes.doublePadding,
        header: classes.doublePadding
    }), [classes]);

    // Classes for nested Section components

    const defaultSectionClasses = React.useMemo(() => ({
        root: classes.doublePadding,
        header: classes.singlePadding,
        content: classes.sectionContent
    }), [classes]);

    const lastOfTypeSectionClasses = React.useMemo(() => ({
        header: classes.singlePadding,
        content: classes.sectionContent
    }), [classes]);

    // Scroll refs

    const userRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;
    const displayRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;
    const storageRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;
    const dataRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;

    const scrollHandler = React.useCallback((ref: React.MutableRefObject<HTMLSpanElement>) => {
        ref.current.scrollIntoView({behavior: "smooth"})
    }, []);

    const scrollMenu = (
        <div className={classes.scrollMenu}>
            <Link
                onClick={() => scrollHandler(userRef)}
                color="inherit"
                variant="body1"
            >
                User
            </Link>
            <Link
                color="inherit"
                variant="body1"
                onClick={() => scrollHandler(displayRef)}
            >
                Display
            </Link>
            <Link
                color="inherit"
                variant="body1"
                onClick={() => scrollHandler(storageRef)}
            >
                Storage
            </Link>
            <Link
                color="inherit"
                variant="body1"
                onClick={() => scrollHandler(dataRef)}
            >
                Data
            </Link>
        </div>
    )

    return (
        <div className={classes.scrollContainer}>
            {scrollMenu}
            <div className={classes.sectionsContainer}>
                <span ref={userRef}></span>
                <UserSettings
                    baseClasses={userSectionClasses}
                />
                <Divider />
                <div className={classes.spacer}></div>
                <span ref={displayRef}></span>
                <DisplaySettings
                    baseClasses={midSectionClasses}
                    sortClasses={lastOfTypeSectionClasses}
                />
                <div className={classes.spacer}></div>
                <span ref={storageRef}></span>
                <StorageSettings
                    baseClasses={midSectionClasses}
                    persistenceClasses={defaultSectionClasses}
                    thresholdClasses={lastOfTypeSectionClasses}
                />
                <div className={classes.spacer}></div>
                <span ref={dataRef}></span>
                <DataSettings
                    baseClasses={bottomSectionClasses}
                    deleteResourcesClasses={defaultSectionClasses}
                    deleteUserClasses={lastOfTypeSectionClasses}
                />
            </div>
        </div>
    )
}

export default SettingsTemplate;
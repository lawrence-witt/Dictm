import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core';

import { RootState } from '../../../../redux/store';

import UserSettings from './sections/User/UserSettings';
import DisplaySettings from './sections/Display/DisplaySettings';
import StorageSettings from './sections/Storage/StorageSettings';
import DataSettings from './sections/Data/DataSettings';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    user: state.user.profile
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

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

const SettingsTemplate: React.FC<ReduxProps> = (props) => {
    const {
        user
    } = props;

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

    const userScrollHandler = React.useCallback(() => { scrollHandler(userRef); }, [scrollHandler]);
    const displayScrollHandler = React.useCallback(() => { scrollHandler(displayRef); }, [scrollHandler]);
    const storageScrollHandler = React.useCallback(() => { scrollHandler(storageRef); }, [scrollHandler]);
    const dataScrollHandler = React.useCallback(() => { scrollHandler(dataRef); }, [scrollHandler]);

    const linkProps = React.useMemo(() => ({
        color: 'inherit' as const,
        variant: 'body1' as const
    }), []);

    const scrollMenu = (
        <div className={classes.scrollMenu}>
            <Link
                {...linkProps}
                onClick={userScrollHandler}
            >
                User
            </Link>
            <Link
                {...linkProps}
                onClick={displayScrollHandler}
            >
                Display
            </Link>
            <Link
                {...linkProps}
                onClick={storageScrollHandler}
            >
                Storage
            </Link>
            <Link
                {...linkProps}
                onClick={dataScrollHandler}
            >
                Data
            </Link>
        </div>
    )

    if (!user) return null;

    return (
        <div className={classes.scrollContainer}>
            {scrollMenu}
            <div className={classes.sectionsContainer}>
                <span ref={userRef}></span>
                <UserSettings
                    baseClasses={userSectionClasses}
                    name={user.attributes.name}
                    greeting={user.settings.preferences.greeting}
                />
                <Divider />
                <div className={classes.spacer}></div>
                <span ref={displayRef}></span>
                <DisplaySettings
                    baseClasses={midSectionClasses}
                    sortClasses={lastOfTypeSectionClasses}
                    sortOrders={user.settings.display.sort}
                />
                <div className={classes.spacer}></div>
                <span ref={storageRef}></span>
                <StorageSettings
                    baseClasses={midSectionClasses}
                    persistenceClasses={defaultSectionClasses}
                    thresholdClasses={lastOfTypeSectionClasses}
                    thresholdValue={user.settings.storage.threshold.value}
                    thresholdUnit={user.settings.storage.threshold.unit}
                />
                <div className={classes.spacer}></div>
                <span ref={dataRef}></span>
                <DataSettings
                    baseClasses={bottomSectionClasses}
                    deleteResourcesClasses={defaultSectionClasses}
                    deleteUserClasses={lastOfTypeSectionClasses}
                    userId={user.id}
                />
            </div>
        </div>
    )
}

export default connector(SettingsTemplate);
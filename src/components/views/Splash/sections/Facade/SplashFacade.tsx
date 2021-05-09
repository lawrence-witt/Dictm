import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import MasonryGrid from '../../../../molecules/MasonryGrid/MasonryGrid';
import NavMenuHeader from '../../../../organisms/NavMenu/Header/NavMenuHeader';
import NavMenuItem from '../../../../organisms/NavMenu/Item/NavMenuItem';

import { _AppBarRow as AppBarRow } from '../../../../organisms/AppBar/Row';
import { _RecordingCard as RecordingCard } from '../../../../molecules/cards/RecordingCard';
import { _NoteCard as NoteCard } from '../../../../molecules/cards/NoteCard';

/* Static Data */

const voidPlaceholder = () => { return; };

const toolVisibility = {
    replay: true,
    search: true,
    delete: true
}

const commonProps = {
    created: 0,
    isSecondaryActive: false,
    isSecondarySelected: false,
    openEditor: voidPlaceholder as any,
    onToggleDelete: voidPlaceholder as any
}

const contentList = [
    {
        id: 'rec1',
        type: 'recording' as const,
        title: "Riff in C",
        duration: 0,
        durationFormatted: "00:27",
        createdFormatted: "08 May 2021",
        ...commonProps
    },
    {
        id: 'note1',
        type: 'note' as const,
        title: "Songs 4 Sampling",
        data: {
            content: "1. Labi Siffe - Watch Me 2. The Beat Goes On - The All Seeing I",
            wordCount: 33,
            charCount: 149
        },
        createdFormatted: "08 May 2021",
        ...commonProps
    },
    {
        id: 'note2',
        type: 'note' as const,
        title: "Lovely Day Lyrics",
        data: {
            content: "When I wake up in the morning, love And the sunlight hurts my eyes",
            wordCount: 148,
            charCount: 770
        },
        createdFormatted: "07 May 2021",
        ...commonProps
    },
    {
        id: 'note3',
        type: 'note' as const,
        title: "Fearless Lyrics",
        data: {
            content: "You say the hill's too steep to climb Chiding You say you'd like to see me try",
            wordCount: 122,
            charCount: 604
        },
        createdFormatted: "05 May 2021",
        ...commonProps
    },
    {
        id: 'rec2',
        type: 'recording' as const,
        title: "New Riff",
        duration: 0,
        durationFormatted: "00:21",
        createdFormatted: "01 May 2021",
        ...commonProps
    },
];

const navItemList = [
    { id: "rec", icon: "recordings", primary: "" },
    { id: "notes", icon: "notes", primary: "" },
    { id: "cat", icon: "categories", primary: "" },
    { id: "settings", icon: "settings", primary: "", divider: true },
    { id: "signout", icon: "signout", primary: "" },
]

/* Component */

const useStyles = makeStyles(theme => ({
    facadeRoot: {
        gridArea: "facade",
        width: '100%',
        height: '100%',
        boxShadow: theme.shadows[4],
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
        userSelect: 'none',

        [theme.breakpoints.up("sm")]: {
            minWidth: 450
        }
    },
    nav: {
        display: 'none',
        width: '56px',
        height: '100%',
        boxShadow: theme.shadows[1],

        "& > div": {
            height: 48
        },

        [theme.breakpoints.up("sm")]: {
            display: 'block'
        }
    },
    content: {
        height: 'fit-content',
        width: '100%',

        [theme.breakpoints.up("sm")]: {
            width: 'calc(100% - 56px)'
        },

        "& .card-grid": {
            display: 'flex',
            height: '100%',
            padding: theme.spacing(1)
        },

        "& .card-col": {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'flex-start',
            padding: theme.spacing(1),

            "& > div:not(:last-child)": {
                marginBottom: theme.spacing(2)
            }
        }
    },
    block: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    }
}))

const SplashFacade: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.facadeRoot}>
            <div className={classes.nav}>
                <NavMenuHeader
                    flow={1}
                    open={false}
                    names={["Tracey"]}
                    onUnNest={voidPlaceholder}
                    onReset={voidPlaceholder}
                />
                {navItemList.map(item => (
                    <NavMenuItem key={item.id} {...item} />
                ))}
            </div>
            <div className={classes.content}>
                <AppBarRow
                    pageTitle="Music"
                    toolVisibility={toolVisibility}
                    searchIsOpen={false}
                    deleteIsOpen={false}
                    onToggleMenu={voidPlaceholder}
                    onToggleDelete={voidPlaceholder}
                    onToggleSearch={voidPlaceholder}
                />
                <MasonryGrid
                    gridClass="card-grid"
                    columnClass="card-col"
                >
                    {contentList.map(item => {
                        switch(item.type) {
                            case "recording": {
                                const { type, ...rest } = item;
                                return <RecordingCard key={item.id} {...rest} />;
                            }
                            case "note": {
                                const { type, ...rest } = item;
                                return <NoteCard key={item.id} {...rest}/>
                            }
                        }
                    })}
                </MasonryGrid>
            </div>
            <div className={classes.block}></div>
        </div>
    )
}

export default SplashFacade;
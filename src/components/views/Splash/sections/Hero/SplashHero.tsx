import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import More from '@material-ui/icons/More'
import { makeStyles, Theme } from '@material-ui/core/styles';

import StyledLink from '../../../../atoms/StyledLink/StyledLink';
import Blade from '../../../../atoms/Blade/Blade';

import { useSafeVh } from '../../../../../lib/providers/SafeVh/SafeVh';

import SplashFacade from '../Facade/SplashFacade';

const useStyles = makeStyles<Theme, {safeVh: string}>(theme => ({
    heroRoot: {
        position: 'relative',
        height: ({safeVh}) => `calc(${safeVh} * 100)`,
        width: '100%',
        overflow: 'hidden',
        padding: theme.spacing(4, 2, 0, 2),

        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(4, 4, 0, 4)
        },

        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(6, 6, 0, 6)
        }
    },
    heroLogo: {
        marginBottom: theme.spacing(3)
    },
    heroGrid: {
        height: '100%',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '2fr 3fr',
        gridTemplateAreas: `
            "text"
            "facade"
        `,

        [theme.breakpoints.up("sm")]: {
            gridTemplateColumns: 'minmax(0, 30vw) 1fr',
            gridTemplateAreas: `
                "text text"
                ". facade"
            `
        },

        [theme.breakpoints.up("md")]: {
            gridTemplateColumns: "auto 12vw 1fr",
            gridTemplateRows: "1fr",
            gridTemplateAreas: `
                "text . facade"
            `
        }
    },
    heroText: {
        gridArea: "text",
        marginBottom: theme.spacing(4),
        maxWidth: 550,

        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(3)
        },

        [theme.breakpoints.up("md")]: {
            marginBottom: "unset",
            marginRight: theme.spacing(4)
        }
    },
    heroTextActions: {
        "& > *:not(:last-child)": {
            marginRight: theme.spacing(2)
        }
    },
    moreButton: {
        position: 'absolute',
        bottom: theme.spacing(4),
        left: theme.spacing(4)
    }
}))

const SplashHero: React.FC<{onExpandClick: () => void}> = ({onExpandClick}) => {
    const safeVh = useSafeVh();

    const classes = useStyles({safeVh});

    return (
        <div className={classes.heroRoot}>
            <Typography 
                className={classes.heroLogo}
                variant="h3"
            >
                Dictm
            </Typography>
            <div className={classes.heroGrid}>
                <div className={classes.heroText}>
                    <Typography 
                        variant="h4"
                    >
                        The integrated note-taking app you can use anywhere
                    </Typography>
                    <div className={classes.heroTextActions}>
                        <StyledLink
                            to="/auth"
                        >
                            <Button 
                                variant="contained" 
                                color="primary" 
                                disableElevation
                            >
                                Try Online
                            </Button>
                        </StyledLink>
                    </div>
                </div>
                <SplashFacade />
            </div>
            <Blade />
            <IconButton 
                className={classes.moreButton}
                onClick={onExpandClick}
            >
                <More/>
            </IconButton>
        </div>
    )
}

export default SplashHero;
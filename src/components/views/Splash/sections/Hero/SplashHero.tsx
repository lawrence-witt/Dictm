import React from 'react';

import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import More from '@material-ui/icons/More'
import { makeStyles } from '@material-ui/core/styles';

import SplashFacade from '../Facade/SplashFacade';

import Blade from '../../../../atoms/Blade/Blade';

const useStyles = makeStyles(theme => ({
    heroRoot: {
        position: 'relative',
        height: '100vh',
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
    const classes = useStyles();

    const history = useHistory();

    const onNavClick = React.useCallback(() => {
        history.push('/auth');
    }, [history]);

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
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disableElevation
                            onClick={onNavClick}
                        >
                            Try Online
                        </Button>
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
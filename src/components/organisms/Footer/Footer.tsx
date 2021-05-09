import React from 'react';

import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    footerRoot: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.getContrastText(theme.palette.common.black),
        width: '100%',
        padding: theme.spacing(4, 2),
        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(4)
        },
        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(6)
        }
    },
    footerLinks: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: theme.spacing(4),

        "& > a, button": {
            width: 'fit-content'
        },

        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(1)
        }
    },
    footerEnd: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    returnButton: {
        textTransform: 'none',

        "& svg": {
            marginLeft: theme.spacing(1)
        }
    }
}));

const Footer: React.FC = () => {
    const classes = useStyles();

    const history = useHistory();

    const handleReturnClick = React.useCallback(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, []);

    return (
        <div className={classes.footerRoot}>
            <div className={classes.footerLinks}>
                <Link 
                    component="button"
                    color="inherit"
                    variant="body1"
                    onClick={() => history.push('/auth')}
                >
                    Try Online
                </Link>
                <Link
                    component="button"
                    color="inherit"
                    variant="body1"
                    onClick={() => console.log('changelog')}
                >
                    Changelog
                </Link>
            </div>
            <div className={classes.footerEnd}>
                <Typography>© w.itt.dev</Typography>
                <Button
                    color="inherit"
                    className={classes.returnButton}
                    onClick={handleReturnClick}
                >
                    <Typography>Return to top</Typography>
                    <ExpandLessIcon/>
                </Button>
            </div>
        </div>
    )
}

export default Footer;
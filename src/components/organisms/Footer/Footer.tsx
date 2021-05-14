import React from 'react';

import Typography from '@material-ui/core/Typography';
import ToolTip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles } from '@material-ui/core/styles';

import StyledLink from '../../atoms/StyledLink/StyledLink';

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

    const handleReturnClick = React.useCallback(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, []);

    return (
        <div className={classes.footerRoot}>
            <div className={classes.footerLinks}>
                <StyledLink 
                    to="/auth"
                    color="inherit"
                >
                    Try Online
                </StyledLink>
                <ToolTip
                    title="Changelog coming soon!"
                    placement="right"
                    arrow
                    enterTouchDelay={0}
                >
                    <StyledLink
                        to="/"
                        onClick={(e: React.MouseEvent) => e.preventDefault()}
                        color="inherit"
                    >
                        Changelog
                    </StyledLink>
                </ToolTip>
                
            </div>
            <div className={classes.footerEnd}>
                <StyledLink
                    to="https://www.itt.dev"
                    external
                    target="_blank"
                    rel="noopener"
                    color="inherit"
                >
                    © w.itt.dev
                </StyledLink>
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
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    slashSVGroot: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 125,

        "& .solid": {
            fill: theme.palette.primary.main
        },

        "& .transparent": {
            fill: theme.palette.primary.main,
            fillOpacity: 0.2
        }
    }
}))

const SlashSVG: React.FC = () => {
    const classes = useStyles();

    return (
        <svg viewBox="0 0 10 10" className={classes.slashSVGroot} preserveAspectRatio="none">
            <polygon points="0,10 10,3 10,10" className="solid"/>
            <polygon points="1,10 10,0 10,10" className="transparent"/>
        </svg>
    )
}

export default SlashSVG;
import React from 'react';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    bladeRoot: {
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

const Blade: React.FC<{className?: string}> = ({className}) => {
    const classes = useStyles();

    return (
        <svg viewBox="0 0 10 10" className={clsx(classes.bladeRoot, className)} preserveAspectRatio="none">
            <polygon points="0,10 10,3 10,10" className="solid"/>
            <polygon points="1,10 10,0 10,10" className="transparent"/>
        </svg>
    )
}

export default Blade;
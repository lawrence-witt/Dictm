import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import { fade, makeStyles } from '@material-ui/core/styles'

import PortalPanel from './Panel/PortalPanel';
import PortalBar from './Bar/PortalBar';

const useStyles = makeStyles(theme => ({
    backdropRoot: {
        backgroundColor: fade(theme.palette.common.white, 0.7)
    },
    paper: {
        width: '100%',
        height: '100%',
        maxHeight: 600
    }
}));

const Portal: React.FC = () => {
    const classes = useStyles();

    return (
        <Dialog
            open={true}
            classes={classes}
            maxWidth="xs"
            BackdropProps={{
                className: classes.backdropRoot
            }}
        >
            <PortalPanel />
            <PortalBar />
        </Dialog>
    )
}

export default Portal;
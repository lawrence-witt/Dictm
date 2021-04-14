import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles'

import * as types from './Auth.types';

import AuthPanel from './Panel/AuthPanel';
import AuthBar from './Bar/AuthBar';

const useStyles = makeStyles(() => ({
    paper: {
        width: '100%',
        height: '100%',
        maxHeight: 600
    }
}));

const Auth: React.FC = () => {
    const classes = useStyles();

    const [panel, setPanel] = React.useState<types.PanelState>({
        prev: undefined,
        current: "home"
    });

    const popPanel = React.useCallback(() => {
        setPanel(p => {
            if (!p.prev) return p;
            return {
                prev: p.current,
                current: p.prev
            }
        })
    }, []);

    const pushPanel = React.useCallback((panel: types.PanelTypes) => {
        setPanel(p => ({
            prev: p.current,
            current: panel
        }))
    }, []);

    return (
        <Dialog
            open={true}
            classes={classes}
            maxWidth="xs"
        >
            <AuthPanel panel={panel} pushPanel={pushPanel}/>
            <AuthBar panel={panel.current} popPanel={popPanel}/>
        </Dialog>
    )
}

export default Auth;
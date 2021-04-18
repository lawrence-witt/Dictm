import React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import * as types from './HybridDrawer.types';

const getTrans = (val: number, m: string) => `translateX(${val}${m})`;
const getTransPx = (val: number) => getTrans(val, 'px');

const getBaseMeasure = (
    flow: types.Flows,
    miniWidth: number,
    fullWidth: number
) => {
    switch(flow) {
        case types.Flows.PERM: return fullWidth;
        case types.Flows.HYBRID: return miniWidth;
        case types.Flows.TEMP:
        default: return 0;
    }
}

const getNewDrawerState = (
    prevFlow: types.Flows,
    nextFlow: types.Flows,
    open: boolean,
    miniWidth: number,
    fullWidth: number
) => {
    const baseWidth = getBaseMeasure(nextFlow, miniWidth, fullWidth);
    let frameWidth = fullWidth;
    let frameTransform = 0;
    let menuShouldTransition = true;

    const prevTemp = prevFlow === types.Flows.TEMP;
    const prevHybrid = prevFlow === types.Flows.HYBRID;
    const nextTemp = nextFlow === types.Flows.TEMP;
    const nextHybrid = nextFlow === types.Flows.HYBRID;

    if ((prevTemp && nextHybrid) || (prevHybrid && nextTemp)) {
        menuShouldTransition = false;
    }

    if (!open && nextTemp) frameTransform = -fullWidth;
    if (!open && nextHybrid) frameWidth = miniWidth;

    return {
        baseWidth,
        frameWidth,
        frameTransform: getTransPx(frameTransform),
        menuShouldTransition
    }
};

// Make Styles

const useDrawerStyles = makeStyles<Theme, types.HybridDrawerStyleProps>(theme => {
    return createStyles({
        hybridDrawerBase: {
            zIndex: theme.zIndex.modal,
            width: ({baseWidth}) => baseWidth,
            transition: ({menuShouldTransition: mst}) => `
                width 
                ${mst ? theme.transitions.duration.standard : 0}ms 
                ${theme.transitions.easing.easeInOut}
            `,
        },
        hybridDrawerFrame: {
            position: 'relative',
            height: '100%',
            width: ({frameWidth}) => frameWidth,
            transform: ({frameTransform}) => frameTransform,
            overflowX: 'hidden',
            transition: ({menuShouldTransition: mst}) => `
                width 
                ${mst ? theme.transitions.duration.standard : 0}ms 
                ${theme.transitions.easing.easeInOut},
                transform 
                ${mst ? theme.transitions.duration.standard : 0}ms 
                ${theme.transitions.easing.easeInOut}
            `,
        },
        hybridDrawerContent: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: ({fullWidth}) => fullWidth
        }
    })
});

// Component

const HybridMenu: React.FC<types.HybridDrawerProps> = ({ 
    children, ...props
}) => {
    const {
        flow = 0,
        open = false,
        miniWidth = 56,
        fullWidth = 275,
        elevation = 8,
        onClose
    } = props;

    const hasEmphasis = flow !== types.Flows.PERM && open;

    const [drawerState, setDrawerState] = React.useState(() => ({
        ...getNewDrawerState(flow, flow, open, miniWidth, fullWidth),
        flow, miniWidth, fullWidth
    }));

    React.useEffect(() => {
        setDrawerState(s => ({
            ...getNewDrawerState(s.flow, flow, open, miniWidth, fullWidth),
            flow, miniWidth, fullWidth
        }))
    }, [flow, open, miniWidth, fullWidth]);

    const classes = useDrawerStyles(drawerState);

    return (
        <Box 
            component="nav" 
            className={classes.hybridDrawerBase}
        >
            <Backdrop open={hasEmphasis} onClick={onClose} />
            <Paper
                className={classes.hybridDrawerFrame}
                elevation={hasEmphasis ? elevation : 1}
                square
            >
                <Box className={classes.hybridDrawerContent}>
                    {children}
                </Box>
            </Paper>
        </Box>
    )
};

export default React.memo(HybridMenu);
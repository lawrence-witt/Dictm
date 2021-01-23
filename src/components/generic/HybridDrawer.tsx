import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';

// Types

enum Flows {
    TEMP,
    HYBRID,
    PERM
}

interface HybridDrawerStyleProps {
    flow: Flows;
    baseWidth: number;
    frameWidth: number;
    frameTransform: string;
    menuShouldTransition: boolean;
    miniWidth: number;
    fullWidth: number;
}

interface HybridDrawerProps {
    children: React.ReactNode;
    flow?: Flows;
    open?: boolean;
    miniWidth?: number;
    fullWidth?: number;
    elevation?: number;
    onClose?: (e: React.MouseEvent) => void;
}

// Helpers

const getTrans = (val: number, m: string) => `translateX(${val}${m})`;
const getTransPx = (val: number) => getTrans(val, 'px');

const getBaseMeasure = (
    flow: Flows,
    miniWidth: number,
    fullWidth: number
) => {
    switch(flow) {
        case Flows.PERM: return fullWidth;
        case Flows.HYBRID: return miniWidth;
        case Flows.TEMP:
        default: return 0;
    }
}

const getNewDrawerState = (
    prevFlow: Flows,
    nextFlow: Flows,
    open: boolean,
    miniWidth: number,
    fullWidth: number
) => {
    const baseWidth = getBaseMeasure(nextFlow, miniWidth, fullWidth);
    let frameWidth = fullWidth;
    let frameTransform = 0;
    let menuShouldTransition = true;

    const prevTemp = prevFlow === Flows.TEMP;
    const prevHybrid = prevFlow === Flows.HYBRID;
    const nextTemp = nextFlow === Flows.TEMP;
    const nextHybrid = nextFlow === Flows.HYBRID;

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

const useDrawerStyles = makeStyles<Theme, HybridDrawerStyleProps>(theme => {
    return createStyles({
        hybridBase: {
            transition: ({menuShouldTransition: mst}) => `
                width 
                ${mst ? theme.transitions.duration.standard : 0}ms 
                ${theme.transitions.easing.easeInOut}
            `,
            overflow: 'visible',
            zIndex: theme.zIndex.modal,
            width: ({baseWidth}) => baseWidth
        },
        hybridFrame: {
            transition: ({menuShouldTransition: mst}) => `
                width 
                ${mst ? theme.transitions.duration.standard : 0}ms 
                ${theme.transitions.easing.easeInOut},
                transform 
                ${mst ? theme.transitions.duration.standard : 0}ms 
                ${theme.transitions.easing.easeInOut}
            `,
            height: '100%',
            width: ({frameWidth}) => frameWidth,
            transform: ({frameTransform}) => frameTransform,
            overflowX: 'hidden'
        },
        hybridContent: {
            height: '100%',
            width: ({fullWidth}) => fullWidth
        }
    })
});

// Component

const HybridMenu: React.FC<HybridDrawerProps> = ({ 
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

    const hasEmphasis = flow !== Flows.PERM && open;

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
            className={classes.hybridBase}
        >
            <Backdrop open={hasEmphasis} onClick={onClose} />
            <Paper
                className={classes.hybridFrame}
                elevation={hasEmphasis ? elevation : 1}
                square
            >
                <Box className={classes.hybridContent}>
                    {children}
                </Box>
            </Paper>
        </Box>
    )
};

export default React.memo(HybridMenu);
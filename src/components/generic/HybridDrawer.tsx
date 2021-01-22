import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';

// ${theme!transitions.duration.standard}ms
const duration = 300;

// Types

enum Flows {
    TEMP,
    HYBRID,
    PERM
}

interface HybridDrawerStyleProps {
    flow: Flows,
    prevFlow: React.RefObject<Flows>,
    open: boolean;
    miniWidth: number;
    fullWidth: number;
}

interface HybridDrawerProps {
    flow: Flows;
    open: boolean;
    miniWidth?: number;
    fullWidth?: number;
    elevation?: number;
    onBackDropClick?: () => void;
}

// Helpers

const getTrans = (val: number, m: string) => `translateX(${val}${m})`;
const getTransPx = (val: number) => getTrans(val, 'px');

const getBaseWidth = (
    flow: Flows, 
    miniWidth: number, 
    fullWidth: number
) => {
    if (flow === Flows.PERM) {
        return fullWidth;
    } else {
        return miniWidth;
    }
};

const getBaseMargin = (
    flow: Flows,
    miniWidth: number
) => {
    if (flow === Flows.TEMP) {
        return -miniWidth;
    } else {
        return 0;
    }
}

const getHybridFrameTransform = (
    flow: Flows,
    open: boolean,
    miniWidth: number,
    fullWidth: number
) => {
    let val = 0;

    if (!open && flow !== Flows.PERM) {
        val = miniWidth - fullWidth;
    }

    if (open && flow === Flows.TEMP) {
        val += miniWidth;
    }
    
    return getTransPx(val);
};

const getContentTransform = (
    flow: Flows,
    open: boolean,
    miniWidth: number,
    fullWidth: number
) => {
    let val = 0;

    if (!open && flow !== Flows.PERM) {
        val = fullWidth - miniWidth;
    }
    
    return getTransPx(val);
};

// Make Styles

const useDrawerStyles = makeStyles<Theme, HybridDrawerStyleProps>(theme => 
    createStyles({
        base: {
            width: ({flow, miniWidth, fullWidth}) => {
                return getBaseWidth(flow, miniWidth, fullWidth);
            },
            marginLeft: ({flow, miniWidth}) => {
                return getBaseMargin(flow, miniWidth);
            },
            overflow: 'visible',
            zIndex: theme.zIndex.modal,
            transition: `
                width 
                ${duration}ms 
                ${theme.transitions.easing.easeInOut},
                margin-left
                ${duration}ms 
                ${theme.transitions.easing.easeInOut}
            `
        },
        hybridFrame: {
            width: ({fullWidth}) => fullWidth,
            transform: ({flow, open, miniWidth, fullWidth}) => {
                return getHybridFrameTransform(flow, open, miniWidth, fullWidth);
            },
            height: '100%',
            transition: `transform
            ${duration}ms
                ${theme.transitions.easing.easeInOut}
            `,
            overflowX: 'hidden'
        },
        content: {
            width: ({fullWidth}) => fullWidth,
            transform: ({flow, open, miniWidth, fullWidth}) => {
                return getContentTransform(flow, open, miniWidth, fullWidth);
            },
            transition: `transform
                ${duration}ms
                ${theme.transitions.easing.easeInOut}
            `
        }
    })
);

// Component

const HybridMenu: React.FC<HybridDrawerProps> = ({ 
    children, ...props
}) => {
    const {
        flow,
        open,
        miniWidth = 56,
        fullWidth = 275,
        elevation = 8,
        onBackDropClick
    } = props;

    const hasEmphasis = flow !== Flows.PERM && open;

    const prevFlow = React.useRef(flow);

    const classes = useDrawerStyles({
        flow,
        prevFlow,
        open,
        miniWidth,
        fullWidth
    });

    return (
        <Box component="nav" className={classes.base}>
            <Backdrop open={hasEmphasis} onClick={onBackDropClick} />
            <Paper
                className={classes.hybridFrame}
                elevation={hasEmphasis ? elevation : 1}
                square
            >
                <Box className={classes.content}>
                    {children}
                </Box>
            </Paper>
        </Box>
    )
};

export default HybridMenu;
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

interface IFlowOpen {
    flow: Flows;
    open: boolean;
}

interface HybridDrawerStyleProps {
    miniWidth: number;
    fullWidth: number;
    frameTransform: number;
    contentTransform: number;
    contentShouldTransition: boolean;
    prev: {
        flow: Flows;
        open: boolean;
    };
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
    switch(flow) {
        case Flows.PERM: return fullWidth;
        case Flows.HYBRID: return miniWidth;
        case Flows.TEMP:
        default: return 0;
    }
};

const getNewTransforms = (
    prevFlow: Flows,
    next: IFlowOpen,
    miniWidth: number,
    fullWidth: number
) => {
    const {flow: nextFlow, open: nextOpen} = next;

    const tempPrev = prevFlow === Flows.TEMP;
    const tempNext = nextFlow === Flows.TEMP;
    const hybridPrev = prevFlow === Flows.HYBRID;
    const hybridNext = nextFlow === Flows.HYBRID;

    let frameTransform = 0;
    let contentTransform = 0;
    let contentShouldTransition = true;

    if (!nextOpen) {
        if (tempNext) {
            frameTransform = -fullWidth;
            if (hybridPrev) contentTransform = fullWidth - miniWidth;
        } else if (hybridNext) {
            frameTransform = -fullWidth + miniWidth;
            contentTransform = fullWidth - miniWidth;
            if (tempPrev) contentShouldTransition = false;
        }
    } else {
        if (tempNext) contentShouldTransition = false;
    }

    return {
        frameTransform,
        contentTransform,
        contentShouldTransition
    }
}

// Make Styles

const useDrawerStyles = makeStyles<Theme, HybridDrawerStyleProps>(theme => 
    createStyles({
        hybridBase: {
            width: ({prev, miniWidth, fullWidth}) => {
                return getBaseWidth(prev.flow, miniWidth, fullWidth);
            },
            overflow: 'visible',
            zIndex: theme.zIndex.modal,
            transition: `
                width 
                ${duration}ms 
                ${theme.transitions.easing.easeInOut}
            `
        },
        hybridFrame: {
            width: ({fullWidth}) => fullWidth,
            transform: ({frameTransform}) => getTransPx(frameTransform),
            height: '100%',
            transition: `transform
            ${duration}ms
                ${theme.transitions.easing.easeInOut}
            `,
            overflowX: 'hidden'
        },
        hybridContent: {
            width: ({fullWidth}) => fullWidth,
            transform: ({contentTransform}) => getTransPx(contentTransform),
            transition: ({contentShouldTransition: cst}) => cst ? `transform
                ${duration}ms
                ${theme.transitions.easing.easeInOut}
            ` : ''
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

    const [menuState, setMenuState] = React.useState(() => ({
        prev: { flow, open },
        ...getNewTransforms(flow, {flow, open}, miniWidth, fullWidth),
        miniWidth,
        fullWidth
    }));

    React.useEffect(() => {
        setMenuState(s => {
            if (s.prev.flow === flow && s.prev.open === open) return s;

            const newTransforms = getNewTransforms(s.prev.flow, {flow, open}, miniWidth, fullWidth);

            return {
                prev: {flow, open},
                ...newTransforms,
                miniWidth,
                fullWidth
            };
        });
    }, [flow, open, miniWidth, fullWidth]);

    const classes = useDrawerStyles(menuState);

    return (
        <Box component="nav" className={classes.hybridBase}>
            <Backdrop open={hasEmphasis} onClick={onBackDropClick} />
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

export default HybridMenu;
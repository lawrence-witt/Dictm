import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
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
    isMenuOpen: boolean;
    isMenuVisible: boolean;
    miniMax: number;
    fullMax: number;
}

interface HybridDrawerProps {
    flow: Flows;
    open: boolean;
    miniMax?: number;
    fullMax?: number;
    elevation?: number;
    toggleMenu?: () => void;
}

// Make Styles

const useDrawerStyles = (props: HybridDrawerStyleProps) => makeStyles(theme =>
    createStyles({
        base: {
            width: () => {
                switch(props.flow) {
                    case Flows.TEMP: return 0;
                    case Flows.HYBRID: return props.miniMax;
                    case Flows.PERM: return props.fullMax;
                    default: return 0;
                }
            },
            overflow: 'visible',
            zIndex: theme.zIndex.modal,
            transition: `
                width 
                ${theme.transitions.duration.standard}ms 
                ${theme.transitions.easing.easeInOut}
            `
        },
        frame: {
            position: 'fixed',
            width: props.fullMax,
            transform: () => {
                let res: string;
                const r = (val: number) => `translateX(${val}px)`;

                const openTrans = 0;
                const hybridTrans = props.miniMax - props.fullMax;
                const closeTrans = -props.fullMax;

                if (props.flow === Flows.PERM) {
                    res = r(openTrans);
                } else if (props.flow === Flows.HYBRID) {
                    res = props.isMenuOpen ? r(openTrans) : r(hybridTrans);
                } else {
                    res = props.isMenuOpen ? r(openTrans) : r(closeTrans);
                }
                
                return res;
            },
            height: '100%',
            transition: `transform
                ${theme.transitions.duration.standard}ms
                ${theme.transitions.easing.easeInOut}
            `,
            overflowX: 'hidden'
        },
        content: {
            position: 'absolute',
            width: props.fullMax,
            transform: () => {
                let res: string;
                const r = (val: number) => `translateX(${val}px)`;

                const openTrans = 0;
                const hybridTrans = props.fullMax - props.miniMax;
                const closeTrans = props.fullMax;

                if (props.flow === Flows.PERM) {
                    res = r(openTrans);
                } else if (props.flow === Flows.HYBRID) {
                    res = props.isMenuOpen ? r(openTrans) : r(hybridTrans);
                } else {
                    res = props.isMenuOpen ? r(openTrans) : r(closeTrans);
                }
                
                return res;
            },
            transition: `transform
            ${theme.transitions.duration.standard}ms
            ${theme.transitions.easing.easeInOut}`
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
        miniMax = 56,
        fullMax = 275,
        elevation = 8
    } = props;

    const isMenuOpen = open;
    const isMenuVisible = flow === Flows.TEMP ? isMenuOpen : true;
    const hasEmphasis = flow !== Flows.PERM && open;

    const classes = useDrawerStyles({
        flow,
        isMenuOpen,
        isMenuVisible,
        miniMax,
        fullMax
    })();

    return (
        <Box component="nav" className={classes.base}>
            <Backdrop open={hasEmphasis} onClick={props.toggleMenu} />
            <Paper
                className={classes.frame}
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
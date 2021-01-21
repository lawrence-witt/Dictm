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

interface IHybridMenu {
    flow: Flows;
    open: boolean;
    miniMax?: number;
    fullMax?: number;
    elevation?: number;
    toggleMenu?: () => void;
}

interface BaseStyleProps {
    flow: Flows;
    isMenuOpen: boolean;
    isMenuVisible: boolean;
    miniMax: number;
    fullMax: number;
}

// Make Styles

const useDrawerStyles = (props: BaseStyleProps) => makeStyles(theme =>
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
            /* width: props.fullMax, */
            width: () => {
                if (props.flow === Flows.PERM) return props.fullMax;
                return props.isMenuOpen ? props.fullMax : props.miniMax;
            },
            height: '100%',
            transform: () => {
                const offset = props.isMenuVisible ? 0 : -100;
                return `translateX(${offset}%)`;
            },
            transition: `
                width
                ${theme.transitions.duration.standard}ms
                ${theme.transitions.easing.easeInOut},
                transform
                ${theme.transitions.duration.standard}ms
                ${theme.transitions.easing.easeInOut}
            `,
            overflowX: 'hidden'
        },
        content: {
            position: 'absolute',
            width: props.fullMax
        }
    })
);

// Component

const HybridMenu: React.FC<IHybridMenu> = ({ 
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
import React from 'react';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';

/* EDITOR DRAWER */
/* 
interface FocusDrawerProps extends DrawerProps {
    forwardRef?: React.RefObject<HTMLDivElement>;
} */

// Styled

const useDrawerStyles = makeStyles(() => ({
    paper: {
        width: '100%',
        maxWidth: 450,
        overflowX: 'hidden'
    }
}));

// Component

const FocusDrawer: React.FC<DrawerProps> = (props) => {
    const {
        id,
        anchor = "right",
        elevation = 8,
        classes = {},
        children,
        ...other
    } = props;

    const drawerClasses = useDrawerStyles();

    return (
        <Drawer
            anchor={anchor}
            elevation={elevation}
            classes={{...drawerClasses, ...classes}}
            PaperProps={{id: id ? id : ''}}
            {...other}
        >
            {children}
        </Drawer>
    );
};


export default FocusDrawer;
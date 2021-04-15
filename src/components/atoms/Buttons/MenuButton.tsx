import React from 'react';

import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';

export interface MenuButtonProps extends IconButtonProps {
    design?: 'bars' | 'dots';
}

const MenuButton = React.forwardRef<
    HTMLButtonElement, MenuButtonProps
>(function MenuButton(props, ref) {
    const {
        design = 'bars',
        ...other
    } = props;

    const Icon = () => {
        switch (design) {
            case 'dots': return <MoreIcon />;
            case 'bars': 
            default:
            return <MenuIcon />;
        }
    };

    return (
        <IconButton
            ref={ref}
            {...other}
        >
            <Icon />
        </IconButton>
    )
})

export default MenuButton;
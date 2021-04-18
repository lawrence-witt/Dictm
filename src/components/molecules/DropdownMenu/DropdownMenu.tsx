import React from 'react';

import Menu from '@material-ui/core/Menu';

import MenuButton from '../../atoms/Buttons/MenuButton';

import { DropdownMenuProps } from './DropdownMenu.types';

const DropdownMenu: React.FC<DropdownMenuProps> = (props) => {
    const {
        buttonProps = {
            color: "inherit",
            design: "dots",
            edge: "end"
        },
        children
    } = props;

    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    const onCloseMenu = React.useCallback(() => setMenuOpen(false), []);
    const onToggleMenu = React.useCallback(() => setMenuOpen(s => !s), []);

    if (typeof children !== "function") return null;
    
    return (
        <>
            <MenuButton
                ref={menuRef}
                onClick={onToggleMenu}
                {...buttonProps}
            />
            <Menu
                open={menuOpen}
                anchorEl={menuRef.current}
                onClose={onCloseMenu}
            >
                {children(onCloseMenu)}
            </Menu>
        </>
    )
}

export default DropdownMenu;
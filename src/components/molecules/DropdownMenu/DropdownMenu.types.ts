import React from 'react';
import { MenuButtonProps } from '../../atoms/Buttons/MenuButton';

export interface DropdownMenuProps {
    buttonProps?: MenuButtonProps;
    children?: (closeMenu: () => void) => React.ReactNode;
}
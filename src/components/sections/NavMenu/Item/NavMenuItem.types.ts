export interface NavMenuItem {
    id: string;
    primary: string;
    icon?: JSX.Element;
    divider?: boolean;
    to?: string;
}

export interface NavMenuItemProps extends NavMenuItem {
    onClick?: () => void;
    onNest?: (to: string) => void;
}
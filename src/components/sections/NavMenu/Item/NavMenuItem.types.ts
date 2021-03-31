import { NavMenuItem } from '../../../../redux/ducks/tools';

export interface NavMenuItemProps extends NavMenuItem {
    onNest?: (to: string) => void;
}
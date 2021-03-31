import { NavMenuItem } from '../../../../redux/ducks/navigation';

export interface NavMenuItemProps extends NavMenuItem {
    onNest?: (to: string) => void;
}
import { NavMenuList } from '../NavMenu.types';

export interface NavMenuSwitchProps {
    list: NavMenuList;
    animation: {
        dir: string;
        active: boolean;
    }
    onNest: (to: string) => void;
}
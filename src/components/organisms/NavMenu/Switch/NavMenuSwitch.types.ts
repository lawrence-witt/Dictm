import { NavMenuList } from '../../../../redux/ducks/navigation';

export interface NavMenuSwitchProps {
    list: NavMenuList;
    animation: {
        dir: string;
        active: boolean;
    }
    onNest: (to: string) => void;
}
import { NavMenuList } from '../../../../redux/ducks/tools';

export interface NavMenuSwitchProps {
    list: NavMenuList;
    animation: {
        dir: string;
        active: boolean;
    }
    onNest: (to: string) => void;
    onSelect: () => void;
}
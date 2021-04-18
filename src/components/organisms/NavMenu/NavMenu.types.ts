import { NavMenuList } from '../../../redux/ducks/navigation';

export interface NavMenuState {
    ids: string[];
    names: string[];
    list: NavMenuList;
    animation: {
        dir: "left" | "right";
        active: boolean;
    }
}
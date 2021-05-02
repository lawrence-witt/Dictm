import { NavMenuList } from '../../../redux/ducks/tools';

export interface NavMenuProps {
    signOut: () => void;
}

export interface NavMenuState {
    ids: string[];
    names: string[];
    list: NavMenuList;
    animation: {
        dir: "left" | "right";
        active: boolean;
    }
}
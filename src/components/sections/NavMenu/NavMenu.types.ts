import { NavMenuItemProps } from './Item/NavMenuItem.types';

export interface NavMenuList {
    id: string;
    name: string;
    items: NavMenuItemProps[];
}

export type NavMenuLists = Record<string, NavMenuList>;

export interface NavMenuState {
    ids: string[];
    names: string[];
    list: NavMenuList;
    lists: NavMenuLists;
    animation: {
        dir: "left" | "right";
        active: boolean;
    }
}

export type IconTypes = 'recordings' | 'notes' | 'categories' | 'settings' | 'signout';
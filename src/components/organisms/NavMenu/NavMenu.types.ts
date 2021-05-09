import { RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { toolSelectors, toolOperations, NavMenuList} from '../../../redux/ducks/tools';
import { userOperations } from '../../../redux/ducks/user';

export interface InjectedNavMenuProps {
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

const mapState = (state: RootState, props: RouteComponentProps & InjectedNavMenuProps) => ({
    isMenuOpen: state.tools.menu.isOpen,
    navLists: toolSelectors.getNavLists(
        state.user.profile, 
        state.content.categories,
        props.history.push,
        props.signOut
    )
});

const mapDispatch = {
    clearUser: userOperations.clearUser,
    onToggleMenu: toolOperations.toggleNavMenu
}

export const connector = connect(mapState, mapDispatch);

export type NavMenuProps = ConnectedProps<typeof connector>;
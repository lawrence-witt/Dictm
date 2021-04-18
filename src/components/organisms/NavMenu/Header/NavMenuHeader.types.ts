export enum Flows {
    TEMP,
    HYBRID,
    PERM
}

export interface MenuHeaderStyleProps {
    isMenuNested: boolean;
    isToggleVisible: boolean;
    isBackButtonVisible: boolean;
}

export interface NavMenuHeaderProps {
    flow: Flows;
    open: boolean;
    names: string[];
    onUnNest: (levels: number) => void;
    onReset: () => void;
}
export enum Flows {
    TEMP,
    HYBRID,
    PERM
}

export interface HybridDrawerStyleProps {
    flow: Flows;
    baseWidth: number;
    frameWidth: number;
    frameTransform: string;
    menuShouldTransition: boolean;
    miniWidth: number;
    fullWidth: number;
}

export interface HybridDrawerProps {
    children: React.ReactNode;
    flow: Flows;
    open: boolean;
    miniWidth?: number;
    fullWidth?: number;
    elevation?: number;
    onClose: (e: React.MouseEvent) => void;
}
import { PanelTypes, PanelState } from '../Auth.types';

export interface AuthPanelProps {
    panel: PanelState;
    pushPanel(panel: PanelTypes): void;
}

export interface AuthPanelSwitchProps {
    panel: PanelTypes;
    pushPanel(panel: PanelTypes): void;
}
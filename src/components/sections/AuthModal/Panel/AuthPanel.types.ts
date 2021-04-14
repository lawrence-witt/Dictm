import { PanelTypes, PanelState } from '../AuthModal.types';

export interface AuthPanelProps {
    panel: PanelState;
    pushPanel(panel: PanelTypes): void;
}

export interface AuthPanelSwitchProps {
    panel: PanelTypes;
    pushPanel(panel: PanelTypes): void;
}
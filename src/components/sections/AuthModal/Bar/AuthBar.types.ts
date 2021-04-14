import { PanelTypes } from '../AuthModal.types';

export interface AuthBarProps {
    panel: PanelTypes;
    popPanel(): void;
}
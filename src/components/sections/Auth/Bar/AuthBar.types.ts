import { PanelTypes } from '../Auth.types';

export interface AuthBarProps {
    panel: PanelTypes;
    popPanel(): void;
}
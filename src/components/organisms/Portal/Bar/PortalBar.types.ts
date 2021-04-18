import { PanelTypes } from '../Portal.types';

export interface PortalBarProps {
    panel: PanelTypes;
    popPanel(): void;
}
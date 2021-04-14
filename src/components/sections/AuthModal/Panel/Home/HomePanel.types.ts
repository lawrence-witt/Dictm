import { PanelTypes } from '../../Auth.types';

export interface HomePanelProps {
    pushPanel(panel: PanelTypes): void;
}
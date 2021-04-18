import { useLocation } from 'react-router-dom';

export interface AppSwitchProps {
    location: ReturnType<typeof useLocation>;
}
import { useLocation } from 'react-router-dom';

export interface DashboardSwitchProps {
    location: ReturnType<typeof useLocation>;
}
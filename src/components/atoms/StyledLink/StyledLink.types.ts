import { Link as RouterLink } from 'react-router-dom';
import { LinkProps } from '@material-ui/core/Link';

export interface StyledLinkProps extends LinkProps<RouterLink> {
    external?: boolean;
}
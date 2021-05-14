import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

import { StyledLinkProps } from './StyledLink.types'

const StyledLink = React.forwardRef<
    HTMLAnchorElement, StyledLinkProps
>(function StyledLink({children, to, external, ...rest}, ref) {
    return (
        <Link
            ref={ref}
            variant="body1"
            component={RouterLink}
            to={external ? { pathname: to } : to}
            {...rest}
        >
            {children}
        </Link>
    )
});

export default StyledLink;
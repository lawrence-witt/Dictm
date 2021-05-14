import React from 'react';

import Link, { LinkProps } from '@material-ui/core/Link';

const AnchorLink = React.forwardRef<
    HTMLAnchorElement, LinkProps<"a">
>(function FooterLink({children, ...rest}, ref) {
    return (
        <Link
            ref={ref}
            variant="body1"
            {...rest}
        >
            {children}
        </Link>
    )
});

export default AnchorLink;
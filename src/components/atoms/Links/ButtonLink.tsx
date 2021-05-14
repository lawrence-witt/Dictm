import React from 'react';

import Link, { LinkProps } from '@material-ui/core/Link';

const ButtonLink = React.forwardRef<
    HTMLButtonElement, LinkProps<"button">
>(function FooterLink({children, ...rest}, ref) {
    return (
        <Link
            ref={ref}
            component="button"
            variant="body1"
            {...rest}
        >
            {children}
        </Link>
    )
});

export default ButtonLink;
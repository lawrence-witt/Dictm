import React from 'react';

import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';

import * as types from './Section.types';

const Section: React.FC<types.SectionProps> = (props) => {
    const {
        title,
        headerVariant = "h5",
        className,
        classes,
        children
    } = props;

    const header = title ? (
        <Typography 
            variant={headerVariant} 
            className={classes?.header}
        >
                {title}
        </Typography>
    ) : [];

    return (
        <section 
            className={clsx(classes?.root, className)}
        >
            {header}
            <div className={classes?.content}>
                {children}
            </div>
        </section>
    )
}

export default Section;
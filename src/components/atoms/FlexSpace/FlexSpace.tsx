import React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

import { FlexSpaceProps } from './FlexSpace.types';

const styles = createStyles({
    flexSpace: {
        flex: ({flex}: FlexSpaceProps) => typeof flex === "undefined" ? 1 : flex
    }
});

const FlexSpace: React.FC<FlexSpaceProps & WithStyles<typeof styles>> = ({classes}) => {
    return <div className={classes.flexSpace}></div>
};

export default withStyles(styles)(FlexSpace);
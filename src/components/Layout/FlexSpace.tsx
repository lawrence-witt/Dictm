import React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

interface FlexProp {
    flex?: string | number;
}

const styles = createStyles({
    flexSpace: {
        flex: ({flex}: FlexProp) => typeof flex === "undefined" ? 1 : flex
    }
});

const FlexSpace: React.FC<FlexProp & WithStyles<typeof styles>> = ({classes}) => {
    return <div className={classes.flexSpace}></div>
};

export default withStyles(styles)(FlexSpace);
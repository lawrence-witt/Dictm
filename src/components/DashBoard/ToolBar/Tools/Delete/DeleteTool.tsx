import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { DeleteToolProps } from './DeleteTool.types';

const useDeleteStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.common.white,
        borderColor: theme.palette.common.white
    }
}))

const DeleteTool: React.FC<DeleteToolProps> = (props) => {
    const {
        contentType,
        quantity
    } = props;

    const classes = useDeleteStyles();

    return (
        <Button
            variant="outlined"
            classes={classes}
        >
            {`Delete ${quantity} ${contentType}`}
        </Button>
    )
}

export default DeleteTool;
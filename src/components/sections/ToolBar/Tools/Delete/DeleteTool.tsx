import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { toolOperations, toolSelectors } from '../../../../../redux/ducks/tools';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    isDeleting: state.tools.delete.isDeleting,
    quantity: toolSelectors.getDeleteQuantity(state.tools.delete),
    context: toolSelectors.getDeleteContext(state.navigation.history.current)
});

const mapDispatch = {
    onCommitDelete: toolOperations.commitDeleteTool
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useDeleteStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.common.white,
        borderColor: theme.palette.common.white,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        display: 'block',

        "& .MuiButton-label": {
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    }
}))

const DeleteTool: React.FC<ReduxProps> = (props) => {
    const {
        isDeleting,
        quantity,
        context,
        onCommitDelete
    } = props;

    const classes = useDeleteStyles();

    return (
        <Button
            variant="outlined"
            classes={classes}
            onClick={onCommitDelete}
            disabled={isDeleting}
        >
            {`Delete ${quantity} ${context}`}
        </Button>
    )
}

export default connector(DeleteTool);
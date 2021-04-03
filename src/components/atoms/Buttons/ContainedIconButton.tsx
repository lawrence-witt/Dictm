import React from 'react';
import clsx from 'clsx';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(theme.palette.grey[300]),
        backgroundColor: theme.palette.grey[300],
        '&:hover': {
            backgroundColor: theme.palette.grey.A100,
            '@media (hover: none)': {
                backgroundColor: theme.palette.grey[300],
            },
            '&$disabled': {
                backgroundColor: theme.palette.action.disabledBackground,
            },
        },
        '&:disabled': {
            color: theme.palette.action.disabled,
            backgroundColor: theme.palette.grey[300]
        }
    },
    disabled: {}
}));

const ContainedIconButton = React.forwardRef<
    HTMLButtonElement, IconButtonProps
>(function ContainedIconButton(props, ref) {
    const {
        classes = {},
        children
    } = props;

    const defaultClasses = useStyles();

    const { root: inheritedRoot, ...inheritedOther } = classes;

    return (
        <IconButton
            ref={ref}
            {...props} 
            classes={{
                ...inheritedOther,
                root: clsx(defaultClasses.root, inheritedRoot)
            }}>
            {children}
        </IconButton>
    )
});

export default ContainedIconButton;
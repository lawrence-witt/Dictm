import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import { withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
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
    label: {},
    edgeStart: {},
    edgeEnd: {},
    colorInherit: {},
    colorPrimary: {},
    colorSecondary: {},
    sizeSmall: {},
    disabled: {}
})

class ContainedIconButton extends React.Component<IconButtonProps> {
    render() {
        const { children } = this.props;

        return (
            <IconButton 
                {...this.props} 
            >
                {children}
            </IconButton>
        )
    }
}

export default withStyles(styles)(ContainedIconButton);
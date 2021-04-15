import React from 'react';

import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(theme => ({
    colorPrimary: {
        '&$checked': {
            color: theme.palette.primary.light,
            '&:hover': {
                backgroundColor: fade(theme.palette.primary.light, theme.palette.action.hoverOpacity)
            },
        },
        '&$disabled': {
            color: theme.palette.action.disabled,
        },
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.light, theme.palette.action.hoverOpacity)
        },
    },
    disabled: {},
    checked: {}
}))

const PrimaryCheckBox: React.FC<CheckboxProps> = (props) => {
    const {
        classes,
        ...other
    } = props;

    const styles = useStyles();

    const combinedClasses = React.useMemo(() => {
        return Object.assign({}, classes, styles);
    }, [classes, styles]);

    return (
        <Checkbox
            {...other}
            color="primary"
            classes={combinedClasses}
        />
    );
};

export default PrimaryCheckBox;
import React from 'react';

import { FormHelperTextProps } from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        top: '100%'
    }
}));

const useAbsoluteFormHelper = (props?: FormHelperTextProps): FormHelperTextProps => {
    const defaultClasses = useStyles();

    const defaultProps = React.useMemo(() => ({
        classes: defaultClasses,
        error: true
    }), [defaultClasses]);

    const formHelperProps = React.useMemo(() => {
        if (!props) return defaultProps;

        const { classes, error, ...rest } = props;
        return {
            classes: Object.assign({}, defaultProps.classes, classes),
            error: typeof error === "undefined" ? defaultProps.error : error,
            ...rest
        }
    }, [defaultProps, props]);

    return formHelperProps;
}

export default useAbsoluteFormHelper;
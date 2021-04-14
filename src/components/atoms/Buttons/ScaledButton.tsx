import React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

interface ScaledButtonProps extends ButtonProps {
    textVariant?: TypographyProps["variant"];
    textProps?: TypographyProps;
}

const ScaledButton: React.FC<ScaledButtonProps> = (props) => {
    const {
        textVariant = "body1",
        textProps = {},
        children,
        ...rest
    } = props;

    return (
        <Button {...rest}>
            <Typography {...textProps} variant={textVariant}>
                {children}
            </Typography>
        </Button>
    )
}

export default ScaledButton;
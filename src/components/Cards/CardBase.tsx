import React from 'react';
import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';
import Checkbox from '@material-ui/core/Checkbox';
import { IconButtonProps } from '@material-ui/core/IconButton';
import Box, { BoxProps } from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Types

interface CardBaseProps {
    onCardAction?: () => void;
    isCheckActive?: boolean;
    isCardFocussed?: boolean;
}

interface CardBasePrimaryRowProps {
    title?: string;
    subTitle?: string;
    date?: string;
}

// Styled

const useBaseStyles = makeStyles<Theme, {isCardFocussed: boolean}>(theme => 
    createStyles({
        root: {
            position: 'relative',
            minWidth: 275,
            maxWidth: 325,

            "&::before": {
                content: '""',
                display: ({isCardFocussed: icf}) => icf ? 'block' : 'none',
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: `3px solid ${theme.palette.primary.main}`,
                borderRadius: 'inherit'
            } 
        },
        buttonBase: {
            position: 'absolute',
            width: '100%',
            height: '100%'
        }
    })
);

const usePrimaryRowStyles = makeStyles(theme => 
    createStyles({
        primaryRow: {
            display: 'grid',
            gridTemplate: '1fr / 50px 1fr',
            columnGap: theme.spacing(1),
            alignItems: 'center',
            height: 65,
            padding: `0px ${theme.spacing(2)}px`,

            "& .title": {
                fontWeight: theme.typography.fontWeightMedium
            },

            "& .subtitle": {
                display: 'flex',
                justifyContent: 'space-between'
            }
        }
    })    
);

const useSecondaryRowStyles = makeStyles(theme => 
    createStyles({
        secondaryRow: {
            display: 'flex',
            padding: `${theme.spacing(1)}px 0px`
        }
    })    
);

// Component

const CardBasePrimaryRow: React.FC<CardBasePrimaryRowProps> = (props) => {
    const {
        title,
        subTitle,
        date,
        children
    } = props;

    const classes = usePrimaryRowStyles();

    return (
        <Box className={classes.primaryRow}>
            {children}
            <Box className="info-box">
                {title && <Typography variant="body2" className="title" noWrap>{title}</Typography>}
                {subTitle && (
                    <Box className="subtitle">
                        <Typography variant="caption" noWrap>{subTitle}</Typography>
                        {date && <Typography variant="caption">{date}</Typography>}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

const CardBase: React.FC<CardBaseProps> = (props) => {
    const {
        onCardAction,
        isCardFocussed = false,
        isCheckActive = false,
        children
    } = props;

    const classes = useBaseStyles({isCardFocussed});

    return (
        <Card className={classes.root}>
            <ButtonBase 
                className={classes.buttonBase} 
                disabled={isCheckActive} 
                onClick={onCardAction}
            />
            {children}
        </Card>
    )
};

export { CardBasePrimaryRow };
export default CardBase;
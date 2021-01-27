import React from 'react';
import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CheckBox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import ContainedIconButton from '../Buttons/ContainedIconButton';

// Types

interface CardBaseProps {
    onCardAction?: () => void;
    isSecondaryActive?: boolean;
    isCardFocussed?: boolean;
}

interface CardBasePrimaryRowProps {
    title?: string;
    subTitle?: string;
    date?: string;
}

interface CardBaseActionSwitchProps {
    primaryIcon?: React.ComponentType;
    contained?: boolean;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    isSecondaryActive?: boolean;
    isSecondarySelected?: boolean;
}

// Styled

const useBaseStyles = makeStyles<Theme, {isCardFocussed: boolean}>(theme => 
    createStyles({
        cardRoot: {
            position: 'relative',
            minWidth: 275,
            maxWidth: 350,

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
            minHeight: 56,
            display: 'grid',
            gridTemplate: '1fr / 50px 1fr',
            columnGap: theme.spacing(1),
            alignItems: 'center',
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,

            "& .title": {
                fontWeight: theme.typography.fontWeightMedium
            },

            "& .subtitle": {
                display: 'flex',
                justifyContent: 'space-between',
                overflow: 'hidden'
            }
        }
    })    
);

const useSecondaryRowStyles = makeStyles(theme => 
    createStyles({
        secondaryRow: {
            padding: `
                0px
                ${theme.spacing(2)}px
                ${theme.spacing(1)}px
                ${theme.spacing(2)}px`,
        },
        divider: {
            marginBottom: theme.spacing(1)
        }
    })
);

const useCommonCardActionStyles = makeStyles(theme => ({
    actionRoot: {
        justifySelf: 'center',
        alignSelf: 'center',
        padding: 7
    },
    iconButtonLabel: {
        height: 24,
        width: 24
    }
}));

const useSecondaryCardActionStyles = makeStyles(theme => ({
    colorSecondary: {
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
}));

// Components

const CardBase: React.FC<CardBaseProps> = (props) => {
    const {
        onCardAction,
        isCardFocussed = false,
        isSecondaryActive = false,
        children
    } = props;

    const classes = useBaseStyles({isCardFocussed});

    return (
        <Card className={classes.cardRoot}>
            <ButtonBase 
                className={classes.buttonBase} 
                disabled={isSecondaryActive} 
                onClick={onCardAction}
            />
            {children}
        </Card>
    )
};

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
                        {date && <Typography variant="caption" noWrap>{date}</Typography>}
                    </Box>
                )}
            </Box>
        </Box>
    )
};

const CardBaseSecondaryRow: React.FC = (props) => {
    const {
        children
    } = props;

    const classes = useSecondaryRowStyles();

    return (
        <Box className={classes.secondaryRow}>
            <Divider className={classes.divider}/>
            {children}
        </Box>
    )
};

const CardBaseActionSwitch: React.FC<CardBaseActionSwitchProps> = (props) => {
    const {
        primaryIcon: PrimaryIcon,
        contained,
        onPrimaryAction,
        onSecondaryAction,
        isSecondaryActive,
        isSecondarySelected
    } = props;

    const comm = useCommonCardActionStyles();
    const sec = useSecondaryCardActionStyles();

    const IconButtonType = contained ? ContainedIconButton : IconButton;

    const PrimaryAction = (
        <IconButtonType 
            edge="start"
            onClick={onPrimaryAction} 
            classes={{
                root: comm.actionRoot, 
                label: comm.iconButtonLabel
            }}>
            <PrimaryIcon />
        </IconButtonType>
    );

    const SecondaryAction = (
        <CheckBox 
            checked={isSecondarySelected}
            onChange={onSecondaryAction}
            edge="start"
            color="secondary"
            classes={{
                root: comm.actionRoot,
                ...sec
            }}
        />
    );

    return isSecondaryActive ? SecondaryAction : PrimaryAction;
};

export { CardBasePrimaryRow, CardBaseSecondaryRow, CardBaseActionSwitch };
export default CardBase;
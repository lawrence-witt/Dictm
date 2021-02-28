import React from 'react';
import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CheckBox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import ContainedIconButton from '../Buttons/ContainedIconButton';
import PrimaryCheckBox from '../Inputs/PrimaryCheckbox';

/* TYPES */

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
    primaryIcon?: React.FunctionComponent;
    contained?: boolean;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    isSecondaryActive?: boolean;
    isSecondarySelected?: boolean;
}

/* CARD BASE */

// Styled

const useBaseStyles = makeStyles<Theme, {isCardFocussed: boolean}>(theme => 
    createStyles({
        cardRoot: {
            position: 'relative',
            maxWidth: 400,
            width: '100%',

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

// Component

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

/* CARD BASE PRIMARY ROW */

// Styled

const usePrimaryRowStyles = makeStyles(theme => 
    createStyles({
        primaryRow: {
            minHeight: 56,
            display: 'grid',
            gridTemplate: '1fr / 50px 1fr',
            columnGap: theme.spacing(1),
            alignItems: 'center',
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        },
        infoBox: {
            overflow: 'hidden',

            "& .title": {
                fontWeight: theme.typography.fontWeightMedium
            },

            "& .subtitle": {
                display: 'flex',
                justifyContent: 'space-between',
                overflow: 'hidden'
            },

            "& .date": {
                whiteSpace: 'nowrap',
                marginLeft: theme.spacing(1)
            }
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

    const titleType = <Typography variant="body2" className="title" noWrap>{title}</Typography>;
    const subtitleType = (
        <div className="subtitle">
            <Typography variant="caption" noWrap>{subTitle}</Typography>
            {date && <Typography variant="caption" className="date">{date}</Typography>}
        </div>
    );

    return (
        <div className={classes.primaryRow}>
            {children}
            <div className={classes.infoBox}>
                {title && titleType}
                {subTitle && subtitleType}
            </div>
        </div>
    )
};

/* CARD BASE SECONDARY ROW */

// Styled

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

// Component

const CardBaseSecondaryRow: React.FC = (props) => {
    const {
        children
    } = props;

    const classes = useSecondaryRowStyles();

    return (
        <div className={classes.secondaryRow}>
            <Divider className={classes.divider}/>
            {children}
        </div>
    )
};

/* CARD BASE ACTION SWITCH */

// Styled

const useActionSwitchStyles = makeStyles(() => ({
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

// Component

const CardBaseActionSwitch: React.FC<CardBaseActionSwitchProps> = (props) => {
    const {
        primaryIcon: PrimaryIcon,
        contained,
        onPrimaryAction,
        onSecondaryAction,
        isSecondaryActive,
        isSecondarySelected
    } = props;

    const classes = useActionSwitchStyles();

    const IconButtonType = contained ? ContainedIconButton : IconButton;

    const PrimaryAction = (
        <IconButtonType 
            edge="start"
            onClick={onPrimaryAction} 
            classes={{
                root: classes.actionRoot, 
                label: classes.iconButtonLabel
            }}>
            {PrimaryIcon && <PrimaryIcon />}
        </IconButtonType>
    );
    
    const SecondaryAction = (
        <PrimaryCheckBox 
            classes={{root: classes.actionRoot}}
            checked={isSecondarySelected}
            onChange={onSecondaryAction}
            edge="start"
        />
    );

    return isSecondaryActive ? SecondaryAction : PrimaryAction;
};

/* EXPORTS */

export { CardBasePrimaryRow, CardBaseSecondaryRow, CardBaseActionSwitch };
export default CardBase;
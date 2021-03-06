import React from 'react';

import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/Tooltip';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import ContainedIconButton from '../../atoms/Buttons/ContainedIconButton';
import PrimaryCheckBox from '../../atoms/Inputs/PrimaryCheckbox';

/* TYPES */

interface CardBaseProps {
    onCardClick: () => void;
    isSecondaryActive?: boolean;
    isCardFocussed?: boolean;
    inert?: boolean;
}

interface CardBasePrimaryRowProps {
    title?: string;
    subTitle?: string;
    createdDate?: string;
}

interface CardBaseActionSwitchProps {
    primaryIcon?: React.FunctionComponent;
    contained?: boolean;
    onPrimaryAction?: () => void;
    isPrimaryPlaceholder?: boolean;
    onSecondaryAction?: () => void;
    isSecondaryActive?: boolean;
    isSecondarySelected?: boolean;
    inert?: boolean;
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
        onCardClick,
        isCardFocussed = false,
        isSecondaryActive = false,
        inert,
        children
    } = props;

    const classes = useBaseStyles({isCardFocussed});

    const inertAttributes = React.useMemo(() => ({
        tabIndex: inert ? -1 : 0,
        ...(inert ? {"aria-hidden": true} : {})
    }), [inert]);

    return (
        <Card className={classes.cardRoot}>
            <ButtonBase 
                className={classes.buttonBase} 
                disabled={isSecondaryActive} 
                onClick={onCardClick}
                {...inertAttributes}
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
        createdDate,
        children
    } = props;

    const classes = usePrimaryRowStyles();

    const titleType = <Typography variant="body2" className="title" noWrap>{title}</Typography>;
    const subtitleType = (
        <div className="subtitle">
            <Typography variant="caption" noWrap>{subTitle}</Typography>
            {createdDate && <Typography variant="caption" className="date">{createdDate}</Typography>}
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
        isPrimaryPlaceholder,
        onSecondaryAction,
        isSecondaryActive,
        isSecondarySelected,
        inert
    } = props;

    const classes = useActionSwitchStyles();

    const IconButtonType = contained ? ContainedIconButton : IconButton;

    const inertAttributes = React.useMemo(() => ({
        tabIndex: inert ? -1 : 0,
        ...(inert ? {"aria-hidden": true} : {})
    }), [inert]);

    const primaryButton = (
        <IconButtonType 
            edge="start"
            onClick={onPrimaryAction} 
            classes={{
                root: classes.actionRoot, 
                label: classes.iconButtonLabel
            }}
            {...inertAttributes}
        >
            {PrimaryIcon && <PrimaryIcon />}
        </IconButtonType>
    );

    // Temporary fallback while implementing playlists

    const primaryAction = isPrimaryPlaceholder ? (
        <ToolTip 
            title="Playlists coming soon!" 
            arrow
            enterTouchDelay={0}
        >
            {primaryButton}
        </ToolTip>
    ) : primaryButton;
    
    const secondaryAction = (
        <PrimaryCheckBox 
            classes={{root: classes.actionRoot}}
            checked={isSecondarySelected}
            onChange={onSecondaryAction}
            edge="start"
            {...inertAttributes}
        />
    );

    return isSecondaryActive ? secondaryAction : primaryAction;
};

/* EXPORTS */

export { CardBasePrimaryRow, CardBaseSecondaryRow, CardBaseActionSwitch };
export default CardBase;
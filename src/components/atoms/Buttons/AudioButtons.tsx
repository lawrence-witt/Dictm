import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import Replay5Icon from '@material-ui/icons/Replay5';
import Forward5Icon from '@material-ui/icons/Forward5';
import PauseIcon from '@material-ui/icons/Pause';
import RecordIcon from '@material-ui/icons/FiberManualRecord';
import { makeStyles, Theme } from '@material-ui/core/styles';

import ContainedIconButton from './ContainedIconButton';

/* TYPES */

interface PrimaryAudioButtonProps extends IconButtonProps {
    icon: 'play' | 'pause' | 'record'
}

/* PRIMARY AUDIO BUTTON */

const usePrimaryStyles = makeStyles<Theme, { disabled: boolean; }>(theme => ({
    buttonLabel: {
        width: '1em',
        height: '1em',
        position: 'relative'
    },
    recIcon: {
        fill: ({disabled}) => disabled ? theme.palette.action.disabled : '#E43737',
        position: 'absolute',
        width: '2em',
        height: '2em'
    }
}));

const PrimaryAudioButton: React.FC<PrimaryAudioButtonProps> = (props) => {
    const {
        icon,
        disabled = false,
        ...other
    } = props;

    const classes = usePrimaryStyles({ disabled });

    const SelectedIcon = {
        play: function I() { return <PlayIcon /> },
        pause: function I() { return <PauseIcon /> },
        record: function I() { return <RecordIcon classes={{root: classes.recIcon}}/> }
    }[icon];

    return (
        <ContainedIconButton 
            classes={{
                label: classes.buttonLabel
            }}
            disabled={disabled}
            {...other}
    >
            {SelectedIcon()}
        </ContainedIconButton>
    )
};

/* PLAY BUTTON */

const PlayButton: React.FC<IconButtonProps> = (props) => (
    <IconButton {...props}>
        <PlayIcon />
    </IconButton>
);

/* PAUSE BUTTON */

const PauseButton: React.FC<IconButtonProps> = (props) => (
    <IconButton {...props}>
        <PauseIcon />
    </IconButton>
);

/* REPLAY 5 BUTTON */

const Replay5Button: React.FC<IconButtonProps> = (props) => (
    <IconButton {...props}>
        <Replay5Icon />
    </IconButton>
);

/* FORWARD 5 BUTTON */

const Forward5Button: React.FC<IconButtonProps> = (props) => (
    <IconButton {...props}>
        <Forward5Icon />
    </IconButton>
);

/* EXPORTS */

export {
    PrimaryAudioButton,
    PlayButton,
    PauseButton,
    Replay5Button,
    Forward5Button
};
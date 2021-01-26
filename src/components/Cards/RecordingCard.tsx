import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Play from '@material-ui/icons/PlayArrow';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import CardBase, { CardBasePrimaryRow, CardBaseSecondaryRow } from './CardBase';

// Needs a permanent background variant (with 9px padding to match checkbox)

const PlayButton: React.FC<IconButtonProps> = (props) => {
    return (
        <IconButton {...props}>
            <Play />
        </IconButton>
    )
}

const useStyles = makeStyles(theme => 
    createStyles({
        button: {
            justifySelf: 'center',
            alignSelf: 'center',
            padding: 9
        }
    })    
)

const RecordingCard: React.FC = () => {
    const classes = useStyles();

    return (
        <CardBase>
            <CardBasePrimaryRow
                title="Recording"
                subTitle="00:02"
                date="11 Nov 2020"
            >
                <PlayButton edge="start" className={classes.button}/>
            </CardBasePrimaryRow>
        </CardBase>
    )
};

export default RecordingCard;
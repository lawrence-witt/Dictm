import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import CardBase, { CardBasePrimaryRow, CardBaseSecondaryRow } from './CardBase';

const useStyles = makeStyles(() => 
    createStyles({
        root: {
            justifySelf: 'center',
            alignSelf: 'center',
            padding: 9
        },
        label: {
            height: 24,
            width: 24
        },
        flex: {
            //
        },
        text: {
            //
            display: 'block'
        }
    })    
)

const TextToSpeechButton: React.FC<IconButtonProps> = (props) => {
    return (
        <IconButton {...props}>
            <Typography variant="h6">T</Typography>
        </IconButton>
    )
};

const NoteCard: React.FC = () => {
    const classes = useStyles();

    return (
        <CardBase>
            <CardBasePrimaryRow
                title="Note"
                subTitle="30 words / 275 chars"
                date="23 Nov 2020"
            >
                <TextToSpeechButton edge="start" classes={{root: classes.root, label: classes.label}}/>
            </CardBasePrimaryRow>
            <CardBaseSecondaryRow>
                <Typography variant="caption" noWrap className={classes.text}>
                    My text preview for this note is much longer and will wrap to the next line
                </Typography>
            </CardBaseSecondaryRow>
        </CardBase>
    );
};

export default NoteCard;
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import CardBase, { CardBasePrimaryRow, CardBaseSecondaryRow, CardBaseActionSwitch } from './CardBase';

const useStyles = makeStyles(theme => 
    createStyles({
        caption: {
            display: 'block'
        },
        textIcon: {
            fontWeight: theme.typography.fontWeightBold
        }
    })    
);

const NoteCard: React.FC = () => {
    const classes = useStyles();

    return (
        <CardBase>
            <CardBasePrimaryRow
                title="Note"
                subTitle="30 words / 275 chars"
                date="23 Nov 2020"
            >
                <CardBaseActionSwitch
                    primaryIcon={() => (
                        <Typography variant="h6" className={classes.textIcon}>
                            T
                        </Typography>
                    )}
                    contained={true}
                    onSecondaryAction={() => console.log('note secondary')}
                    isSecondaryActive={false}
                    isSecondarySelected={true}
                />
            </CardBasePrimaryRow>
            <CardBaseSecondaryRow>
                <Typography variant="caption" noWrap className={classes.caption}>
                    My text preview for this note is much longer and will wrap to the next line
                </Typography>
            </CardBaseSecondaryRow>
        </CardBase>
    );
};

export default NoteCard;
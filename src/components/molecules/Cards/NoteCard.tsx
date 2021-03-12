import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import CardBase, { CardBasePrimaryRow, CardBaseSecondaryRow, CardBaseActionSwitch } from './CardBase';

interface NoteCardProps {
    title: string;
    details: { wordCount: number; charCount: number; };
    content: string;
    createdAt: number;
}

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

const NoteCard: React.FC<NoteCardProps> = (props) => {
    const {
        title,
        details,
        content,
        createdAt
    } = props;

    const classes = useStyles();

    return (
        <CardBase>
            <CardBasePrimaryRow
                title={title}
                subTitle={`${details.wordCount} words / ${details.charCount} chars`}
                createdDate={createdAt.toString()}
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
                    isSecondarySelected={false}
                />
            </CardBasePrimaryRow>
            <CardBaseSecondaryRow>
                <Typography variant="caption" noWrap className={classes.caption}>
                    {content}
                </Typography>
            </CardBaseSecondaryRow>
        </CardBase>
    );
};

export default NoteCard;
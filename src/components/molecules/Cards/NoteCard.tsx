import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import CardBase, { CardBasePrimaryRow, CardBaseSecondaryRow, CardBaseActionSwitch } from './CardBase';

interface NoteCardProps {
    title: string;
    data: {
        content: string;
        wordCount: number; 
        charCount: number;
    }
    created: number;
    onCardClick: () => void;
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
        data,
        created,
        onCardClick
    } = props;

    const classes = useStyles();

    return (
        <CardBase
            onCardClick={onCardClick}
        >
            <CardBasePrimaryRow
                title={title}
                subTitle={`${data.wordCount} words / ${data.charCount} chars`}
                createdDate={created.toString()}
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
                    {data.content}
                </Typography>
            </CardBaseSecondaryRow>
        </CardBase>
    );
};

export default NoteCard;
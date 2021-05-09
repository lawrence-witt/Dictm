import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import CardBase, { CardBasePrimaryRow, CardBaseSecondaryRow, CardBaseActionSwitch } from '../CardBase';

import * as types from './NoteCard.types';

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

const NoteCard: React.FC<types.NoteCardProps> = (props) => {
    const {
        id,
        title,
        data,
        createdFormatted,
        isSecondaryActive,
        isSecondarySelected,
        inert,
        onToggleDelete,
        openEditor
    } = props;

    const classes = useStyles();

    const onCardClick = React.useCallback(() => {
        openEditor("note", id);
    }, [openEditor, id]);

    const onSecondaryAction = React.useCallback(() => {
        onToggleDelete("note", id);
    }, [onToggleDelete, id]);

    const typographyIcon = React.useCallback(() => (
        <Typography variant="h6" className={classes.textIcon}>
            T
        </Typography>
    ), [classes.textIcon]);

    return (
        <CardBase
            onCardClick={onCardClick}
            isSecondaryActive={isSecondaryActive}
            inert={inert}
        >
            <CardBasePrimaryRow
                title={title}
                subTitle={`${data.wordCount} words / ${data.charCount} chars`}
                createdDate={createdFormatted}
            >
                <CardBaseActionSwitch
                    primaryIcon={typographyIcon}
                    contained={true}
                    isPrimaryPlaceholder={true}
                    onSecondaryAction={onSecondaryAction}
                    isSecondaryActive={isSecondaryActive}
                    isSecondarySelected={isSecondarySelected}
                    inert={inert}
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
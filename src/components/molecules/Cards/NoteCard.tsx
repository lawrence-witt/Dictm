import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { editorOperations } from '../../../redux/ducks/editor';
import { toolOperations, toolSelectors } from '../../../redux/ducks/tools';
import { mediaSelectors } from '../../../redux/ducks/media';

import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import CardBase, { CardBasePrimaryRow, CardBaseSecondaryRow, CardBaseActionSwitch } from './CardBase';

interface NoteCardProps {
    id: string;
    title: string;
    data: {
        content: string;
        wordCount: number; 
        charCount: number;
    }
    created: number;
}

/* 
*   Redux
*/

const mapState = (state: RootState, props: NoteCardProps) => ({
    isSecondaryActive: state.tools.delete.isOpen,
    isSecondarySelected: toolSelectors.getDeleteToggledStatus(
        state.tools.delete,
        "notes",
        props.id
    ),
    createdFormatted: mediaSelectors.getFormattedTimestamp(props.created)
});

const mapDispatch = {
    openEditor: editorOperations.openEditor,
    onToggleDelete: toolOperations.toggleDeleteResource
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

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

const NoteCard: React.FC<NoteCardProps & ReduxProps> = (props) => {
    const {
        id,
        title,
        data,
        createdFormatted,
        isSecondaryActive,
        isSecondarySelected,
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

export default connector(NoteCard);
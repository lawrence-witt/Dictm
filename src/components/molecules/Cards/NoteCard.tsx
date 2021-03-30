import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { editorOperations } from '../../../redux/ducks/editor';

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

const mapDispatch = {
    openEditor: editorOperations.openEditor
}

const connector = connect(null, mapDispatch);

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
        created,
        openEditor
    } = props;

    const classes = useStyles();

    const onCardClick = React.useCallback(() => {
        openEditor("note", id);
    }, [openEditor, id]);

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

export default connector(NoteCard);
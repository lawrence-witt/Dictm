import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AlbumIcon from '@material-ui/icons/Album';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    icon: {
        justifyContent: 'center'
    }
}));

const ChoosePanel: React.FC = () => {
    const classes = useStyles();

    return (
        <>
            <ListItem button disableGutters>
                <ListItemIcon className={classes.icon}><AlbumIcon /></ListItemIcon>
                <ListItemText primary="Recording"/>
            </ListItem>
            <ListItem button disableGutters>
                <ListItemIcon className={classes.icon}><EventNoteIcon /></ListItemIcon>
                <ListItemText primary="Note"/>
            </ListItem>
        </>
    )
};

export default ChoosePanel;
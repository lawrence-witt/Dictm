import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { userOperations } from '../../../../../../../redux/ducks/user';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Section from '../../../../../../molecules/Section/Section';

import * as types from './DataSettings.types';

/* 
*   Redux
*/

const mapDispatch = {
    deleteUser: userOperations.deleteUser,
    deleteUserData: userOperations.deleteUserData
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(theme => ({
    buttonContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        marginLeft: -theme.spacing(2),
        marginBottom: -theme.spacing(1),

        "& button": {
            marginLeft: theme.spacing(2),
            marginBottom: theme.spacing(1)
        }
    }
}));

const DataSettingsDialog: React.FC<types.DataSettingsDialogProps & ReduxProps> = (props) => {
    const {
        open,
        type,
        userId,
        closeModal,
        deleteUser,
        deleteUserData
    } = props;

    const modalText = React.useMemo(() => {
        switch(type) {
            case "recordings":
            case "notes":
            case "categories":
                return `Are you sure you want to delete your ${type}?`;
            case "user":
                return 'Are you sure you want to delete this user?';
        }
    }, [type]);

    const handleDeletionConfirmed = React.useCallback(() => {
        if (type === "user") {
            deleteUser(userId);
        } else {
            deleteUserData(type);
        }
        closeModal();
    }, [type, userId, deleteUser, deleteUserData, closeModal]);

    return (
        <Dialog
            open={open}
            onClose={closeModal}
        >
            <DialogContent>
                <DialogContentText>
                    {modalText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    color="primary"
                    onClick={handleDeletionConfirmed}
                >
                    Confirm
                </Button>
                <Button 
                    color="primary"
                    onClick={closeModal}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
};

const ConnectedDataSettingsDialog = connector(DataSettingsDialog);

const DataSettings: React.FC<types.DataSettingsProps> = (props) => {
    const {
        baseClasses,
        deleteResourcesClasses,
        deleteUserClasses,
        userId
    } = props;

    const classes = useStyles();

    const [dataModal, setDataModal] = React.useState<types.DataSettingsDialogState>({
        open: false,
        type: "recordings"
    });

    const { open, type } = dataModal;

    const closeModal = React.useCallback(() => {
        setDataModal(d => ({
            ...d,
            open: false
        }));
    }, []);

    const openModal = React.useCallback((type: types.DataTypes) => {
        setDataModal({
            open: true,
            type
        })
    }, []);

    const openRecordingsModal = React.useCallback(() => { openModal("recordings") }, [openModal]);
    const openNotesModal = React.useCallback(() => { openModal("notes") }, [openModal]);
    const openCategoriesModal = React.useCallback(() => { openModal("categories") }, [openModal]);
    const openUserModal = React.useCallback(() => { openModal("user") }, [openModal]);

    return (
        <>
        <ConnectedDataSettingsDialog 
            open={open}
            type={type}
            closeModal={closeModal}
            userId={userId}
        />
        <Section
            title="Data"
            classes={baseClasses}
        >
            <Section
                title="Delete Resources"
                headerVariant="h6"
                classes={deleteResourcesClasses}
            >
                <Typography>
                    Delete all resources of a particular type from this account.
                </Typography>
                <div className={classes.buttonContainer}>
                    <Button 
                        variant="outlined"
                        onClick={openRecordingsModal}
                    >
                        Delete Recordings
                    </Button>
                    <Button 
                        variant="outlined"
                        onClick={openNotesModal}
                    >
                        Delete Notes
                    </Button>
                    <Button 
                        variant="outlined"
                        onClick={openCategoriesModal}
                    >
                        Delete Categories
                    </Button>
                </div>
            </Section>
            <Section
                title="Delete User"
                headerVariant="h6"
                classes={deleteUserClasses}
            >
                <Typography>
                    Delete this account and all its associated resources.
                </Typography>
                <div className={classes.buttonContainer}>
                    <Button 
                        variant="outlined"
                        onClick={openUserModal}
                    >
                            Delete User
                    </Button>
                </div>
            </Section>
        </Section>
        </>
    )
}

export default DataSettings;
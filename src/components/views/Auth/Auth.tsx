import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import { fade, makeStyles } from '@material-ui/core/styles'

import { RootState } from '../../../redux/store';
import { authOperations, authSelectors } from '../../../redux/ducks/auth';

import SlashSVG from '../../atoms/SlashSVG/SlashSVG';

import Slider from '../../molecules/Slider/Slider';

import AuthHome from './frames/Home/AuthHome';
import AuthLocal from './frames/Local/AuthLocal';
import AuthNew from './frames/New/AuthNew';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    location: state.history.current,
    frameTransition: authSelectors.getAuthAnimation(state.history),
    userLoaded: Boolean(state.user.profile)
});

const mapDispatch = {
    loadLocalUsers: authOperations.loadLocalUsers,
    loadSelectedUser: authOperations.loadSelectedUser,
    createNewUser: authOperations.createNewUser,
    clearLocalUsers: authOperations.clearLocalUsers,
    clearNewUser: authOperations.clearNewUser
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(theme => ({
    backdrop: {
        backgroundColor: fade(theme.palette.common.white, 0.7)
    },
    paper: {
        width: '100%',
        height: '100%',
        maxHeight: 600
    },
    sliderRoot: {
        overflowX: 'hidden'
    },
    sliderFrame: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
        }
    }
}));

const Auth: React.FC<ReduxProps> = (props) => {
    const {
        location,
        frameTransition,
        loadLocalUsers,
        loadSelectedUser,
        createNewUser,
        clearLocalUsers
    } = props;

    const classes = useStyles();

    React.useEffect(() => {
        loadLocalUsers();
        return () => clearLocalUsers();
    }, [loadLocalUsers, clearLocalUsers]);

    const [authMethod, setAuthMethod] = React.useState<"load" | "create" | null>(null);

    const setLoadMethod = React.useCallback(() => setAuthMethod("load"), []);
    const setCreateMethod = React.useCallback(() => setAuthMethod("create"), []);

    const onDialogExited = React.useCallback(() => {
        if (!authMethod) return;
        ({load: loadSelectedUser, create: createNewUser}[authMethod])();
    }, [authMethod, loadSelectedUser, createNewUser]);

    const item = React.useMemo(() => {
        return {
            key: "pathname" as const,
            object: location
        }
    }, [location]);

    return (
        <>
            <Dialog
                open={!authMethod}
                onExited={onDialogExited}
                classes={{
                    paper: classes.paper
                }}
                maxWidth="xs"
                BackdropProps={{
                    className: classes.backdrop
                }}
            >
                <Slider 
                    item={item}
                    enter={frameTransition.dir}
                    exit={frameTransition.dir}
                    disabled={!frameTransition.active}
                    classes={{
                        root: classes.sliderRoot,
                        frame: classes.sliderFrame
                    }}
                >
                    {(location) => (
                        <Switch location={location}>
                            <Route exact path="/auth" component={AuthHome} />
                            <Route exact path="/auth/local" render={() => <AuthLocal setLoadMethod={setLoadMethod}/>} />
                            <Route exact path="/auth/new" render={() => <AuthNew setCreateMethod={setCreateMethod}/>} />
                            <Redirect to="/auth" />
                        </Switch>
                    )}
                </Slider>
            </Dialog>
            <SlashSVG />
        </>
    )
}

export default connector(Auth);
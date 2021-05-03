import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import { fade, makeStyles } from '@material-ui/core/styles'

import { RootState } from '../../../redux/store';
import { authOperations, authSelectors } from '../../../redux/ducks/auth';

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
    setAppTransition: authOperations.setAppTransition,
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
        userLoaded,
        loadLocalUsers,
        setAppTransition,
        clearLocalUsers,
        clearNewUser
    } = props;

    const classes = useStyles();

    React.useEffect(() => {
        loadLocalUsers()
    }, [loadLocalUsers]);

    const item = React.useMemo(() => {
        return {
            key: "pathname" as const,
            object: location
        }
    }, [location]);

    const onUserLoaded = React.useCallback(() => {
        setAppTransition("greet");
        clearLocalUsers();
        clearNewUser();
    }, [setAppTransition, clearLocalUsers, clearNewUser]);

    return (
        <Dialog
            open={!userLoaded}
            onExited={onUserLoaded}
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
                        <Route exact path="/auth/local" component={AuthLocal} />
                        <Route exact path="/auth/new" component={AuthNew} />
                        <Redirect to="/auth" />
                    </Switch>
                )}
            </Slider>
        </Dialog>
    )
}

export default connector(Auth);
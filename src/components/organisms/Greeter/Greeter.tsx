import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { a, useSpring } from 'react-spring';

import { RootState } from '../../../redux/store';
import { authOperations } from '../../../redux/ducks/auth';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    profile: state.user.profile,
    appTransition: state.auth.app.transition
});

const mapDispatch = {
    setAppTransition: authOperations.setAppTransition
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(theme => ({
    greeter: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        userSelect: 'none',

        "& > *": {
            marginBottom: theme.spacing(2)
        }
    }
}));

const Greeter: React.FC<ReduxProps> = (props) => {
    const {
        profile,
        appTransition,
        setAppTransition
    } = props;

    const [display, setDisplay] = React.useState(appTransition === "greet");

    const classes = useStyles();

    const { opacity } = useSpring({
        opacity: appTransition === "greet" ? 0.8 : 0,
        onRest: () => setDisplay(false)
    });

    const onDismiss = React.useCallback(() => {
        setAppTransition(undefined);
    }, [setAppTransition]);

    if (!profile || !display) return null;

    return (
        <a.div 
            className={classes.greeter} 
            style={{opacity: opacity as any}}
            onClick={onDismiss}
        >
            <Typography variant="h4">
                {profile.settings.preferences.greeting}
            </Typography>
            <Typography>
                Click anywhere to dismiss.
            </Typography>
        </a.div>
    )
}

export default connector(Greeter);
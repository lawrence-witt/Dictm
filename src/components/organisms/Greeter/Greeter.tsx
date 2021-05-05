import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { a, useSpring } from 'react-spring';

import { RootState } from '../../../redux/store';
import { userOperations } from '../../../redux/ducks/user';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { formatLongTimestamp } from '../../../lib/utils/formatTime';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    session: state.user.session,
    profile: state.user.profile
});

const mapDispatch = {
    updateSessionContext: userOperations.updateUserSessionContext
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
        session,
        profile,
        updateSessionContext
    } = props;

    const context = session?.context;

    const [display, setDisplay] = React.useState(context === "returning");

    const classes = useStyles();

    const { opacity } = useSpring({
        opacity: context === "returning" ? 0.8 : 0,
        onRest: () => setDisplay(false)
    });

    const onDismiss = React.useCallback(() => {
        updateSessionContext(undefined);
    }, [updateSessionContext]);

    if (!session || !profile || !display) return null;

    const greeting = profile.settings.preferences.greeting || `Welcome back, ${profile.attributes.name}!`;
    const lastVisited = `You last visited on ${formatLongTimestamp(session.timestamps.previous)}.`;

    return (
        <a.div 
            className={classes.greeter} 
            style={{opacity: opacity as any}}
            onClick={onDismiss}
        >
            <Typography variant="h4">
                {greeting}
            </Typography>
            <Typography variant="h6">
                {lastVisited}
            </Typography>
            <Typography>
                Click anywhere to dismiss.
            </Typography>
        </a.div>
    )
}

export default connector(Greeter);
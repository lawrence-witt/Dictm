import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { hot } from 'react-hot-loader';
import { useHistory } from 'react-router-dom';
import { a } from 'react-spring';

import { RootState } from '../../../redux/store';
import { navigationOperations, navigationSelectors } from '../../../redux/ducks/navigation';

import { makeStyles } from '@material-ui/core/styles';

import AppSwitch from '../../../routes/AppSwitch/AppSwitch';

import ToolBar from '../../sections/ToolBar/ToolBar';
import NavBar from '../../sections/NavBar/NavBar';
import NavMenu from '../../sections/NavMenu/NavMenu';
import Editor from '../../sections/Editor/Editor';

import AuthModal from '../../sections/AuthModal/AuthModal';

import useUniqueTransition from '../../../lib/hooks/useUniqueTransition'

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    location: state.navigation.history.current,
    transition: navigationSelectors.getTemplateAnimation(
        state.categories, 
        state.navigation.history
    )
});

const mapDispatch = {
    changeLocation: navigationOperations.changeLocation
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(() => ({
    fixedBase: {
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'fixed'
    },
    pageBase: {
        height: '100%',
        width: '100%',
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column'
    },
    templateBase: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    templateFrame: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
}));

const App: React.FC<ReduxProps> = (props): React.ReactElement => {
    const {
        location,
        transition,
        changeLocation
    } = props;

    const classes = useStyles();

    const history = useHistory();

    const { dir, active } = transition;

    const left = dir === "left";

    React.useLayoutEffect(() => {
        const unlisten = history.listen((location) => {
            changeLocation(location);
        });

        changeLocation(history.location);

        return () => unlisten();
    }, [history, changeLocation]);

    const templateTransition = useUniqueTransition("pathname", location, {
        initial: {transform: 'translateX(0%)'},
        from: active && { transform: `translateX(${left ? '' : '-'}100%)`},
        enter: { transform: 'translateX(0%)'},
        leave: active && { transform: `translateX(${left ? '-' : ''}100%)`}
    });

    /* return (
        <div className={classes.fixedBase}>
            <NavMenu/>
            <div className={classes.pageBase}>
                <ToolBar/>
                <div className={classes.templateBase}>
                    {templateTransition((style, location) => (
                        <a.div className={classes.templateFrame} style={style}>
                            <AppSwitch location={location}/>
                        </a.div>
                    ))}
                </div>
                <Editor />
                <NavBar />
            </div>
        </div>
    ) */
    return <AuthModal/>;
};

export default hot(module)(connector(App));
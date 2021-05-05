import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../redux/store';
import { toolSelectors } from '../../../redux/ducks/tools';
import { userOperations } from '../../../redux/ducks/user';

import AppBar from '../../organisms/AppBar/AppBar';
import NavBar from '../../organisms/NavBar/NavBar';
import NavMenu from '../../organisms/NavMenu/NavMenu';
import Editor from '../../organisms/Editor/Editor';
import Greeter from '../../organisms/Greeter/Greeter';

import Slider from '../../molecules/Slider/Slider';

import Content from './frames/Content/Content';
import Settings from './frames/Settings/Settings';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    location: state.history.current,
    frameTransition: toolSelectors.getDashboardAnimation(
        state.content.categories, state.history
    )
});

const mapDispatch = {
    signOut: userOperations.clearUser
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
    }
}));

const Dashboard: React.FC<ReduxProps> = (props) => {
    const {
        location,
        frameTransition,
        signOut
    } = props;

    const classes = useStyles();

    const item = React.useMemo(() => {
        return {
            key: "pathname" as const,
            object: location
        }
    }, [location]);

    return (
        <>
            <div className={classes.fixedBase}>
                <NavMenu signOut={signOut}/>
                <div className={classes.pageBase}>
                    <AppBar/>
                    <Slider 
                        item={item}
                        enter={frameTransition.dir}
                        exit={frameTransition.dir}
                        disabled={!frameTransition.active}
                    >
                        {(location) => (
                            <Switch location={location}>
                                <Route 
                                    exact 
                                    path="/recordings" 
                                    render={() => 
                                        <Content 
                                            context="recordings"
                                        />
                                    }
                                />
                                <Route 
                                    exact 
                                    path="/notes" 
                                    render={() => 
                                        <Content 
                                            context="notes"
                                        />
                                    }
                                />
                                <Route 
                                    exact 
                                    path="/categories/:categoryId?" 
                                    render={({match}) => 
                                        <Content 
                                            context="categories" 
                                            categoryId={match.params.categoryId} 
                                        />
                                    }
                                />
                                <Route 
                                    exact
                                    path="/settings"
                                    component={Settings}
                                />
                                <Redirect to="/recordings" />
                            </Switch>
                        )}
                    </Slider>
                    <Editor />
                    <NavBar />
                </div>
            </div>
            <Greeter/>
        </>
    )
}

export default connector(Dashboard);
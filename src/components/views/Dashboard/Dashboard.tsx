import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../redux/store';
import { toolSelectors } from '../../../redux/ducks/tools';

import AppBar from '../../organisms/AppBar/AppBar';
import NavBar from '../../organisms/NavBar/NavBar';
import NavMenu from '../../organisms/NavMenu/NavMenu';
import Editor from '../../organisms/Editor/Editor';

import Slider from '../../molecules/Slider/Slider';

import Content from './frames/Content/Content';
import Settings from './frames/Settings/Settings';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    location: state.history.current,
    transition: toolSelectors.getDashboardAnimation(state.content.categories, state.history)
});

const connector = connect(mapState);

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
        transition
    } = props;

    const classes = useStyles();

    const item = React.useMemo(() => {
        return {
            key: "pathname" as const,
            object: location
        }
    }, [location]);

    return (
        <div className={classes.fixedBase}>
            <NavMenu/>
            <div className={classes.pageBase}>
                <AppBar/>
                <Slider 
                    item={item}
                    enter={transition.dir}
                    exit={transition.dir}
                    disabled={!transition.active}
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
    )
}

export default connector(Dashboard);
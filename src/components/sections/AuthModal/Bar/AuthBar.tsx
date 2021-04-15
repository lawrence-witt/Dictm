import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Home from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';

import { RootState } from '../../../../redux/store';
import { authOperations, authSelectors } from '../../../../redux/ducks/auth';

import FlexSpace from '../../../atoms/FlexSpace/FlexSpace';
import DirectionButton from '../../../atoms/Buttons/DirectionButton';

/* Redux */

const mapState = (state: RootState) => ({
    currentPanel: state.auth.panel.current,
    canLoadUser: authSelectors.getCanLoadUser(state.auth.local.selectedId),
    canCreateUser: authSelectors.getCanCreateUser(state.auth.new)
});

const mapDispatch = {
    popPanel: authOperations.popAuthPanel,
    loadUser: authOperations.loadSelectedUser,
    createUser: authOperations.createNewUser
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* Local */

const AuthBar: React.FC<ReduxProps> = (props) => {
    const {
        currentPanel,
        canLoadUser,
        canCreateUser,
        popPanel,
        loadUser,
        createUser
    } = props;

    /* Primary Button */

    const homeHandler = React.useCallback(() => console.log('nav to splash'), []);
    const popHandler = React.useCallback(() => popPanel(), [popPanel]);

    const primaryButton = React.useMemo(() => {
        switch(currentPanel) {
            case "home": 
                return (
                    <IconButton
                        edge="start"
                        onClick={homeHandler}
                    >
                        <Home/>
                    </IconButton>  
                );
            default: 
                return (
                    <DirectionButton
                        edge="start"
                        design="arrow" 
                        direction="left"
                        onClick={popHandler}
                    />
                )
        }
    }, [currentPanel, popHandler, homeHandler]);

    /* Secondary Button */

    const secondaryText = React.useMemo(() => ({
        home: "",
        local: "Load",
        new: "Get Started"
    }[currentPanel]), [currentPanel]);

    const secondaryHandler = React.useMemo(() => ({
        home: () => {/**/},
        local: loadUser,
        new: createUser
    }[currentPanel]), [currentPanel, loadUser, createUser]);

    const secondaryDisabled = React.useMemo(() => ({
        home: false,
        local: !canLoadUser,
        new: !canCreateUser
    }[currentPanel]), [currentPanel, canLoadUser, canCreateUser]);

    const secondaryButton = React.useMemo(() => {
        switch(currentPanel) {
            case "home": return null;
            default: {
                return (
                    <Button
                        variant="outlined"
                        onClick={secondaryHandler}
                        disabled={secondaryDisabled}
                    >
                        {secondaryText}
                    </Button>
                )
            }
        }
    }, [currentPanel, secondaryText, secondaryHandler, secondaryDisabled]);

    return (
        <Toolbar>
            {primaryButton}
            <FlexSpace />
            {secondaryButton}
        </Toolbar>
    )
}

export default connector(AuthBar);
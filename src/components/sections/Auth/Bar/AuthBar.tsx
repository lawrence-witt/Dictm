import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Home from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import * as types from './AuthBar.types';

import FlexSpace from '../../../atoms/FlexSpace/FlexSpace';
import DirectionButton from '../../../atoms/Buttons/DirectionButton';

const AuthBar: React.FC<types.AuthBarProps> = (props) => {
    const {
        panel,
        popPanel
    } = props;

    /* Primary Button Home Option */

    const homeHandler = React.useCallback(() => console.log('nav to splash'), []);

    const homeButton = React.useMemo(() => (
        <IconButton
            onClick={homeHandler}
        >
            <Home/>
        </IconButton>
    ), [homeHandler]);

    /* Primary Button */

    const popHandler = React.useCallback(() => popPanel(), [popPanel]);

    const primaryButton = React.useMemo(() => {
        switch(panel) {
            case "home": 
                return homeButton;
            default: 
                return (
                    <DirectionButton 
                        design="arrow" 
                        direction="left"
                        onClick={popHandler}
                    />
                )
        }
    }, [panel, popHandler, homeButton]);

    /* Secondary Button */

    const secondaryText = React.useMemo(() => ({
        home: "",
        localUsers: "Load",
        newUser: "Get Started"
    }[panel]), [panel]);

    const secondaryHandler = React.useMemo(() => ({
        home: () => {/**/},
        localUsers: () => console.log('load user'),
        newUser: () => console.log('create user')
    }[panel]), [panel]);

    const secondaryButton = React.useMemo(() => {
        switch(panel) {
            case "home": return null;
            default: {
                return (
                    <Button
                        variant="outlined"
                        onClick={secondaryHandler}
                    >
                        {secondaryText}
                    </Button>
                )
            }
        }
    }, [panel, secondaryText, secondaryHandler]);

    return (
        <DialogActions>
            {primaryButton}
            <FlexSpace />
            {secondaryButton}
        </DialogActions>
    )
}

export default AuthBar;
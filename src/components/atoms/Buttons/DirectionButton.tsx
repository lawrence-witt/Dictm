import React from 'react';

import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ArrowRight from '@material-ui/icons/ArrowForward';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Types

type Direction = 'up' | 'right' | 'down' | 'left';

interface ChevronButtonStyleProps {
    direction?: Direction;
}

interface ChevronButtonProps extends ChevronButtonStyleProps, IconButtonProps {
    design?: 'chevron' | 'arrow';
}

// Styled

const useStyles = makeStyles<Theme, {direction: Direction}>(() => 
    createStyles({
        icon: {
            transform: props => {
                const val = (() => {
                    switch(props.direction) {
                        case 'up': return -90;
                        case 'down': return 90;
                        case 'left': return 180;
                        case 'right':
                        default: return 0;
                    }
                })();
                
                return `rotateZ(${val}deg)`;
            }
        }
    })    
);

// Component

const DirectionButton: React.FC<ChevronButtonProps> = (props) => {
    const {
        design = 'chevron',
        direction = 'right',
        ...other
    } = props;

    const classes = useStyles({direction})

    const Icon = (iprops: SvgIconProps) => {
        switch(design) {
            case 'arrow': return <ArrowRight {...iprops}/>
            case 'chevron':
            default: return <ChevronRight {...iprops}/>
        }
    }
        
    return (
        <IconButton {...other}>
            <Icon className={classes.icon}/>
        </IconButton>
    )
}

export { Direction };
export default DirectionButton;
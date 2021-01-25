import React from 'react';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

interface Props extends SvgIconProps {
    type: 'in' | 'out'
}

const useStyles = makeStyles<Theme, {type: 'in' | 'out'}>(() => 
    createStyles({
        root: {
            transform: ({type}) => `rotateZ(${type === 'out' ? '180deg' : 0})`
        }
    })
)

const AuthIcon: React.FC<Props> = ({type, ...props}) => {
    const { root } = useStyles({type});

    return <ExitToApp className={root} {...props} />
}

export default AuthIcon;
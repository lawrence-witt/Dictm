import React from 'react';

import clsx from 'clsx';
import { animated } from 'react-spring';
import { makeStyles } from '@material-ui/core/styles';

import useUniqueTransition from '../../../lib/hooks/useUniqueTransition';

import * as types from './Slider.types';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    frame: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
}));

function Slider<
    T extends {[key: string]: any}
>(
    props: React.PropsWithChildren<types.SliderProps<T>>
): JSX.Element | null {
    const {
        disabled = false,
        enter = 'left',
        exit = 'left',
        classes = {
            root: "",
            frame: ""
        },
        item,
        children
    } = props;

    const defaultClasses = useStyles();

    const enterValue = {
        top: '0%, 100%',
        left: '100%, 0%',
        bottom: '0%, -100%',
        right: '-100%, 0%'
    }[enter];

    const exitValue = {
        top: '0%, -100%',
        left: '-100%, 0%',
        bottom: '0%, 100%',
        right: '100%, 0%'
    }[exit];

    const frameTransition = useUniqueTransition(item.key, item.object, {
        initial: { transform: 'translate(0%, 0%)' },
        from: !disabled && { transform: `translate(${enterValue})` },
        enter: { transform: 'translate(0%, 0%)' },
        leave: !disabled && { transform: `translate(${exitValue})` }
    });

    if (typeof children !== "function") return null;

    return (
        <div className={clsx(classes.root, defaultClasses.root)}>
            {frameTransition((style, item) => (
                <animated.div className={clsx(classes.frame, defaultClasses.frame)} style={style}>
                    {children(item)}
                </animated.div>
            ))}
        </div>
    )
}

export default Slider;
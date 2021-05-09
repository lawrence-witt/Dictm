import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

import KeyControl from '../../atoms/KeyControl/KeyControl';

import * as types from './ReleaseAccordion.types';

const useStyles = makeStyles(theme => ({
    accordionRoot: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        },
        "& svg": {
            fill: theme.palette.getContrastText(theme.palette.primary.main)
        }
    },
    featuresAccordion: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main)
    },
    improvementsAccordion: {
        backgroundColor: theme.palette.info.dark,
        color: theme.palette.getContrastText(theme.palette.info.dark)
    },
    fixesAccordion: {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.getContrastText(theme.palette.error.dark)
    },
    accordionDetails: {
        padding: theme.spacing(2),
        margin: 'unset',
        marginLeft: theme.spacing(2),

        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(1)
        }
    }
}))

const ReleaseAccordion: React.FC<types.ReleaseAccordionProps> = (props) => {
    const {
        features,
        improvements,
        fixes
    } = props;

    const classes = useStyles();

    return (
        <KeyControl
            keys={["features", "improvements", "fixes"]}
            className={classes.accordionRoot}
        >
            {(key, setKey) => (
                <>
                    {features ? (
                        <Accordion
                            expanded={key === "features"}
                            onChange={() => features.length > 0 && setKey(key === "features" ? undefined : "features")}
                            style={{overflow: 'hidden'}}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                className={classes.featuresAccordion}
                            >
                                <Typography variant="h6">Features - ({features.length})</Typography>
                            </AccordionSummary>
                            <ul
                                className={classes.accordionDetails}
                            >
                                {features.map((feature, i) => <li key={i}>{feature}</li>)}
                            </ul>
                        </Accordion>
                    ) : []}
                    {improvements ? (
                        <Accordion
                            expanded={key === "improvements"}
                            onChange={() => improvements.length > 0 && setKey(key === "improvements" ? undefined : "improvements")}
                            style={{overflow: 'hidden'}}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                className={classes.improvementsAccordion}
                            >
                                <Typography variant="h6">Improvements - ({improvements.length})</Typography>
                            </AccordionSummary>
                            <ul
                                className={classes.accordionDetails}
                            >
                                {improvements.map((improvement, i) => <li key={i}>{improvement}</li>)}
                            </ul>
                        </Accordion>
                    ) : []}
                    {fixes ? (
                        <Accordion
                            expanded={key === "fixes"}
                            onChange={() => fixes.length > 0 && setKey(key === "fixes" ? undefined : "fixes")}
                            style={{overflow: 'hidden'}}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                className={classes.fixesAccordion}
                            >
                                <Typography variant="h6">Bug Fixes - ({fixes.length})</Typography>
                            </AccordionSummary>
                            <ul
                                className={classes.accordionDetails}
                            >
                                {fixes.map((fixe, i) => <li key={i}>{fixe}</li>)}
                            </ul>
                        </Accordion>
                    ) : []}
                </>
            )}
        </KeyControl>
    )
}

export default ReleaseAccordion;
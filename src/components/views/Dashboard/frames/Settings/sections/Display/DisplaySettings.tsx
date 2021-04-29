import React from 'react';

import Typography from '@material-ui/core/Typography';

import Section from '../../../../../../molecules/Section/Section';
import { SectionClasses } from '../../../../../../molecules/Section/Section.types';

import CustomSelect from '../../../../../../atoms/Inputs/CustomSelect';

interface DisplaySettingsProps {
    baseClasses: SectionClasses;
    sortClasses: SectionClasses;
}

const orderOptions = [
    {id: "createdDesc", title: "Created date (newest first)"},
    {id: "createdAsc", title: "Created date (oldest first)"},
    {id: "modifiedDesc", title: "Last Modified date (newest first)"},
    {id: "modifiedAsc", title: "Last Modified date (oldest first)"},
    {id: "alphaDesc", title: "Alphabetically (A > Z)"},
    {id: "alphaAsc", title: "Alphabetically (Z > A)"}
];

const DisplaySettings: React.FC<DisplaySettingsProps> = (props) => {
    const {
        baseClasses,
        sortClasses
    } = props;

    return (
        <Section
            title="Display"
            classes={baseClasses}
        >
            <Section
                title="Sort Order"
                headerVariant="h6"
                classes={sortClasses}
            >
                <Typography>
                    Choose how you would like resources to be sorted in the card view.
                </Typography>
                <CustomSelect
                    fullWidth
                    label="Recordings"
                    required
                    selected={""}
                    options={orderOptions}
                    onChange={() => { console.log('d') }}
                />
                <CustomSelect
                    fullWidth
                    label="Notes"
                    required
                    selected={""}
                    options={orderOptions}
                    onChange={() => { console.log('d') }}
                />
                <CustomSelect
                    fullWidth
                    label="Categories"
                    required
                    selected={""}
                    options={orderOptions}
                    onChange={() => { console.log('d') }}
                />
                <CustomSelect
                    fullWidth
                    label="Mixed Category"
                    required
                    selected={""}
                    options={orderOptions}
                    onChange={() => { console.log('d') }}
                />
            </Section>
        </Section>
    )
}

export default DisplaySettings;
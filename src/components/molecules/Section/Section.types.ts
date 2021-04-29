import { TypographyProps } from '@material-ui/core/Typography';

export interface SectionClasses {
    root?: string;
    header?: string;
    content?: string;
}

export interface SectionProps {
    title?: string;
    headerVariant?: TypographyProps["variant"];
    className?: string;
    classes?: SectionClasses;
}
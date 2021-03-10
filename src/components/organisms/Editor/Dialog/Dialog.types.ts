import { DialogProps as MuiDialogProps } from '@material-ui/core/Dialog';

import { SaveDialogProps } from './Save/SaveDialog.types';
import { DetailsDialogProps } from './Details/DetailsDialog.types';

export interface DialogProps extends MuiDialogProps {
    schema: { 
        type: 'save', 
        props: SaveDialogProps 
    } | {
        type: 'details',
        props: DetailsDialogProps
    }
}
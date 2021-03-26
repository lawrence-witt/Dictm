import { CassettePublicFlags } from 'cassette-js';

export interface FormProps {
    title: string;
    category: string | undefined;
    flags: CassettePublicFlags;
}
import { CassettePublicFlags } from 'cassette-js';

export interface FormProps {
    title: string;
    category: { id: string } | undefined;
    flags: CassettePublicFlags;
}
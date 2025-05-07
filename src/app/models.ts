export interface Choice {
    original: string;
    regularization: string;
}

export interface Word {
    id: string;
    text: string | Choice;
    lemma: string;
    pos: string; // part of speech
    msd: string; // morphosyntactic description
}

export type Line = Word[];

export interface Verse {
    line: Line;
    num: number;
}

export interface Note {
    head?: string;
    place: string;
    type: string;
    line: Line;
}

export interface Lassa {
    n: string;
    verses: Verse[];
}

export interface Page {
    n: string;
    notes: Note[];
    lassas: Lassa[]; // TODO: choose the correct english name for "lassa"
}

// <w xml:id="t146" n="146" lemma="le" pos="DETdef" msd="NOMB.=s|GENRE=m|CAS=r">Li</w>

// <w xml:id="t72c1a" n="72c1a" lemma="prendre" pos="VERppe" msd="NOMB.=s|GENRE=f|CAS=n">
//     <choice>
//         <orig> pris </orig>
//         <reg> prise </reg>
//     </choice>
// </w>

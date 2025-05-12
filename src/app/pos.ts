export type POSCategory =
    | "VER"
    | "NOM"
    | "ADJ"
    | "PRO"
    | "DET"
    | "ADV"
    | "PRE"
    | "CON"
    | "INJ"
    | "PON"
    | "ETR"
    | "ABR"
    | "RED"
    | "OUT";

export function posIs(prefix: POSCategory, value: string) {
    return value.startsWith(prefix);
}

// pos="ADVneg.PROper" msd="PERS.=3|NOMB.=s|GENRE=m|CAS=r"
export type PosType =
    | "cjg"
    | "inf"
    | "ppe"
    | "ppa" // VER
    | "com"
    | "pro" // NOM
    | "qua"
    | "ind"
    | "car"
    | "ord"
    | "pos" // ADJ
    | "per"
    | "imp"
    | "adv"
    | "dem"
    | "rel"
    | "int" // PRO
    | "def"
    | "ndf" // DET
    | "gen"
    | "neg"
    | "sub" // ADV
    | "coo" // CON
    | "fbl"
    | "frt"
    | "pga"
    | "pdr"
    | "pxx" // PON
;
export type Mode = "ind" | "imp" | "con" | "sub";
export type Temps = "pst" | "ipf" | "fut" | "psp";
export type Pers = "0" | "1" | "2" | "3";
export type Nomb = "s" | "p" | "-";
export type Genre = "m" | "f" | "n" | "-";
export type Cas = "n" | "r" | "i" | "-";
export type Degre = "p" | "c" | "s";
export type Contr =
    | ".PROper"
    | ".PROadv"
    | ".DETdef"
    | ".DETcom"
    | ".DETrel"
    | ".PROrel";

export type Spec = "it" | "probl";
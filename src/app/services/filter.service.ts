import { Injectable, signal } from "@angular/core";
import {
  Cas,
  Contr,
  Degre,
  Genre,
  Mode,
  Nomb,
  Pers,
  POSCategory,
  PosType,
  Spec,
  Temps,
} from "../pos";
import { Word } from "../models";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  currentFilter = signal<WordsFilter>(EMPTY_FILTER);

  isWordHighlighted(w: Word, f: WordsFilter) {
    const morpho = msdToFilter(w.msd);
    const pos = posToFilter(w.pos);

    const data: FilterSelection = { ...pos, ...morpho };

    const isIncluded = <T>(a: T[], b: T[]) =>
      a.every((item) => b.includes(item));

    // and
    if (f.op === "and") {
      const keysIncluded =
        (Object.keys(f.selection) as (keyof FilterSelection)[])
          .filter((k) => f.selection[k].length > 0)
          .map((k) => isIncluded(f.selection[k], data[k]));
      return keysIncluded.length > 0 && keysIncluded.every((t) => t === true);
    }

    // or
    const keysExist = (Object.keys(f.selection) as (keyof FilterSelection)[])
      .filter((k) => f.selection[k].length > 0)
      .map((k) => f.selection[k].some((v) => data[k].includes(v as never)));
    return keysExist.length > 0 && keysExist.some((t) => t === true);
  }
}

export type FilterSelection = {
  categ: POSCategory[];
  type: PosType[];
  mode: Mode[];
  temps: Temps[];
  pers: Pers[];
  nomb: Nomb[];
  genre: Genre[];
  cas: Cas[];
  degre: Degre[];
  contr: Contr[];
  spec: Spec[];
};

export type WordsFilter = {
  op: "and" | "or";
  selection: FilterSelection;
};

export const EMPTY_SELECTION: FilterSelection = {
  categ: [],
  type: [],
  mode: [],
  temps: [],
  pers: [],
  nomb: [],
  genre: [],
  cas: [],
  degre: [],
  contr: [],
  spec: [],
};

export const EMPTY_FILTER: WordsFilter = {
  op: "and",
  selection: EMPTY_SELECTION,
};

function msdToFilter(
  msd: string,
): Omit<FilterSelection, "categ" | "type" | "contr"> {
  // "NOMB.=s|GENRE=f|CAS=n" => Omit<FilterSelection, "categ" | "type">
  type T = Omit<FilterSelection, "categ" | "type" | "contr">;
  const o: T = {
    mode: [],
    temps: [],
    pers: [],
    nomb: [],
    genre: [],
    cas: [],
    degre: [],
    spec: [],
  };

  const morphoCategories = msd.replaceAll(".", "").split("|").map((x) =>
    x.split("=")
  );
  morphoCategories.forEach((a) => {
    const k = a[0].toLowerCase() as keyof T;
    if (k in o && a[1] !== undefined) {
      o[k].push(a[1] as never);
    }
  });

  return o;
}

function posToFilter(
  pos: string,
): Pick<FilterSelection, "categ" | "type" | "contr"> {
  const o: Pick<FilterSelection, "categ" | "type" | "contr"> = {
    categ: [],
    type: [],
    contr: [],
  };

  const [prefix, contr] = pos.split(".");
  if (contr !== undefined) {
    o.contr.push(`.${contr}` as Contr);
  }

  const match = prefix.match(/^([A-Z]+)([a-z].*)$/);
  if (match) {
    const c = match[1] as POSCategory;
    const t = match[2] as PosType;

    o.categ.push(c);
    o.type.push(t);
  }
  return o;
}

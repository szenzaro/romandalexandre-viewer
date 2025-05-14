import { httpResource } from "@angular/common/http";
import { computed, Injectable } from "@angular/core";
import { capitalize, Choice, Lassa, Note, Page, Verse, Word } from "../models";

@Injectable({
  providedIn: "root",
})
export class DataService {
  xmlResource = httpResource.text("RomandAlexandre_Digitale_Uff.xml");
  xmlText = computed(() => this.xmlResource.value());
  pages = computed(() => {
    const text = this.xmlText();
    if (text === undefined) {
      return [{
        notes: [],
        lassas: [],
        n: "1r",
      }];
    }
    return parsePages(text);
  });
}

interface PageSource {
  n: string;
  children: Element[];
}

function parsePages(text: string): Page[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "application/xml");
  const nodes = [...xmlDoc.querySelector("body>p")?.children ?? []];

  const pagesElements = nodes.reduce((prev, curr) => {
    if (curr.tagName === "pb") {
      return [{ n: curr.getAttribute("n") ?? "", children: [] }, ...prev];
    }
    const [first, ...rest] = prev;
    const children = [...first.children, curr];
    return [{ ...first, children }, ...rest];
  }, [] as PageSource[]).reverse();

  return pagesElements.map((p) => parsePage(p, parser));
}

function parsePage(pageSource: PageSource, parser: DOMParser): Page {
  const p: Page = {
    n: pageSource.n,
    notes: [],
    lassas: [],
  };

  pageSource.children.forEach((c) => {
    switch (c.tagName) {
      case "noteGrp":
        p.notes = parseNoteGrp(c, parser);
        break;
      case "lg":
        const l = parseLassa(c);
        p.lassas.push(l);
        break;
      default:
        console.error("parsePage :: unknown tag while parsing ", c);
    }
  });

  return p;
}

function parseNoteGrp(notGrp: Element, parser: DOMParser): Note[] {
  return [...notGrp.children].map((n) =>
    n.getAttribute("type") === "miniatura_rubricata"
      ? parseMiniaturaRubricata(n)
      : parseNotaAlMiniatore(n)
  );
}

function parseMiniaturaRubricata(e: Element): Note {
  return {
    head: e.querySelector("figure>head")?.textContent ?? "ERR",
    place: e.querySelector("figure")?.getAttribute("place") ?? "ERR",
    type: noteTypeToString(e.getAttribute("type")),
    line: [...e.querySelector("figure>figDesc>mentioned")?.children ?? []].map(
      parseWord,
    ),
  };
}

function parseNotaAlMiniatore(e: Element): Note {
  return {
    place: e.getAttribute("place") ?? "ERR",
    type: noteTypeToString(e.getAttribute("type")),
    line: [...e.children].map(parseWord),
  };
}

function noteTypeToString(type: string | null) {
  return capitalize(type || "ERR").replaceAll("_", " ");
}

function parseLassa(lg: Element): Lassa {
  return {
    n: lg.getAttribute("n") || "ERR", // TODO: check err
    verses: [...lg.children].map((e) => parseVerse(e)),
  };
}

function parseVerse(l: Element): Verse {
  return {
    num: Number(l.getAttribute("n")),
    line: [...l.children].map((e) => parseWord(e)),
  };
}

function parseWord(e: Element): Word {
  const text = e.firstElementChild === null
    ? (e.firstChild?.textContent ?? "ERR").trim()
    : parseChoice(e.firstElementChild);

  return {
    id: e.getAttribute("xml:id") || "ERR", // TODO: check error
    text,
    lemma: e.getAttribute("lemma") || "ERR", // TODO: check error
    pos: e.getAttribute("pos") || "ERR", // TODO: check error,
    msd: e.getAttribute("msd") || "ERR", // TODO: check error,
  };
}

function parseChoice(e: Element): Choice {
  return {
    original: (e.firstElementChild?.textContent ?? "ERR").trim(),
    regularization: (e.lastElementChild?.textContent ?? "ERR").trim(),
  };
}

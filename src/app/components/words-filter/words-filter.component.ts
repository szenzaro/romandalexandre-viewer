import {
  Component,
  computed,
  effect,
  output,
  signal,
  viewChildren,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Button } from "primeng/button";
import { MultiselectComponent } from "../multiselect/multiselect.component";
import {
  EMPTY_SELECTION,
  FilterSelection,
  WordsFilter,
} from "../../services/filter.service";
import { capitalize } from "../../models";

@Component({
  selector: "app-words-filter",
  imports: [Button, ReactiveFormsModule, MultiselectComponent],
  templateUrl: "./words-filter.component.html",
  styleUrl: "./words-filter.component.scss",
})
export class WordsFilterComponent {
  op = signal<"and" | "or">("and");
  selection = signal<FilterSelection>(EMPTY_SELECTION);

  #filter = computed<WordsFilter>(() => ({
    op: this.op(),
    selection: this.selection(),
  }));

  filterChange = output<WordsFilter>();
  filterChangeEffect = effect(() => this.filterChange.emit(this.#filter()));

  data = Object.keys(this.selection()).map((key) => ({
    label: capitalize(key),
    key: key as keyof FilterSelection,
  }));

  multiselects = viewChildren(MultiselectComponent);

  options: FilterSelection = {
    categ: [
      "VER",
      "NOM",
      "ADJ",
      "PRO",
      "DET",
      "ADV",
      "PRE",
      "CON",
      "INJ",
      "PON",
      "ETR",
      "ABR",
      "RED",
      "OUT",
    ],
    type: [
      "cjg",
      "inf",
      "ppe",
      "ppa", // VER
      "com",
      "pro", // NOM
      "qua",
      "ind",
      "car",
      "ord",
      "pos", // ADJ
      "per",
      "imp",
      "adv",
      "dem",
      "rel",
      "int", // PRO
      "def",
      "ndf", // DET
      "gen",
      "neg",
      "sub", // ADV
      "coo", // CON
      "fbl",
      "frt",
      "pga",
      "pdr",
      "pxx", // PON
    ],
    mode: ["ind", "imp", "con", "sub"],
    temps: ["pst", "ipf", "fut", "psp"],
    pers: ["0", "1", "2", "3"],
    nomb: ["s", "p", "-"],
    genre: ["m", "f", "n", "-"],
    cas: ["n", "r", "i", "-"],
    degre: ["p", "c", "s"],
    contr: [
      ".PROper",
      ".PROadv",
      ".DETdef",
      ".DETcom",
      ".DETrel",
      ".PROrel",
    ],
    spec: ["it", "probl"],
  };

  toggleOp() {
    this.op.update((v) => v === "and" ? "or" : "and");
  }

  updateSelection<K extends keyof FilterSelection>(
    key: K,
    value: any[], //FilterSelection[K],
  ) {
    this.selection.update((o) => ({ ...o, [key]: value }));
  }

  clearSelection() {
    this.selection.set(EMPTY_SELECTION);
    this.multiselects().map((m) => m.clearSelection());
  }
}



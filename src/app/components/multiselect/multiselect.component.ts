import { Component, effect, input, output, signal, viewChild } from "@angular/core";
import { Button } from "primeng/button";
import { FloatLabel } from "primeng/floatlabel";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-multiselect",
  imports: [FloatLabel, MultiSelect, Button],
  templateUrl: "./multiselect.component.html",
  styleUrl: "./multiselect.component.scss",
})
export class MultiselectComponent<T> {
  options = input.required<T[]>();
  name = input<string>("Select");

  selection = signal<T[]>([]);

  change = output<T[]>();

  multiSelect = viewChild.required(MultiSelect);

  emitChange = effect(() => {
    this.change.emit(this.selection());
  });

  clearSelection() {
    this.multiSelect().updateModel([]);
  }
}

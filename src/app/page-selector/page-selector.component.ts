import {
  Component,
  effect,
  input,
  model,
  output,
} from "@angular/core";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { Select } from "primeng/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-page-selector",
  imports: [InputGroupAddonModule, InputTextModule, ButtonModule, Select, FormsModule, ReactiveFormsModule],
  templateUrl: "./page-selector.component.html",
  styleUrl: "./page-selector.component.scss",
})
export class PageSelectorComponent {
  pageIds = input.required<string[]>();
  page = model.required<string>();
  pageChange = output<string>();
  pageGangeEffect = effect(() => this.pageChange.emit(this.page()));

  next() {
    this.page.update((p) => {
      const idx = this.pageIds().indexOf(p);
      const len = this.pageIds().length - 1;
      return this.pageIds()[idx === len ? idx : idx + 1];
    });
  }

  prev() {
    this.page.update((p) => {
      const idx = this.pageIds().indexOf(p);
      return this.pageIds()[idx > 0 ? idx - 1 : idx];
    });
  }
}




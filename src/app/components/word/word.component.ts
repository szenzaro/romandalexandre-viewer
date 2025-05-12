import { Component, computed, inject, input } from "@angular/core";
import { Choice, Word } from "../../models";
import { DecodeHtmlPipe } from "../../pipes/decode-html.pipe";
import { PopoverModule } from "primeng/popover";
import { ButtonModule } from "primeng/button";
import { FilterService } from "../../services/filter.service";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrl: "./word.component.scss",
  imports: [
    DecodeHtmlPipe,
    PopoverModule,
    ButtonModule,
  ],
})
export class WordComponent {
  filterService = inject(FilterService);

  word = input.required<Word>();

  isString = computed(() => typeof this.word().text === "string");
  text = computed(() => this.word().text as string);
  choice = computed(() =>
    this.isString() ? undefined : this.word().text as Choice
  );

  isHighlighted = computed(() => (this.filterService.isWordHighlighted(this.word(), this.filterService.currentFilter())))

  popoverTitle = computed(() =>
    this.isString()
      ? this.word().text as string
      : `${this.choice()?.regularization ?? ""}`
  );

  popoverText = computed(() => "ciao <br> mondo!");
}

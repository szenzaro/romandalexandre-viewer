import { Component, computed, input } from "@angular/core";
import { Choice, Word } from "../../models";
import { DecodeHtmlPipe } from "../../pipes/decode-html.pipe";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrl: "./word.component.scss",
  imports: [DecodeHtmlPipe, NgbPopoverModule],
})
export class WordComponent {
  word = input.required<Word>();

  isString = computed(() => typeof this.word().text === "string");
  text = computed(() => this.word().text as string);
  choice = computed(() =>
    this.isString() ? undefined : this.word().text as Choice
  );

  popoverTitle = computed(() =>
    this.isString()
      ? this.word().text as string
      : `${this.choice()?.regularization ?? ""}`
  );

  popoverText = computed(() => "ciao <br> mondo!")
}

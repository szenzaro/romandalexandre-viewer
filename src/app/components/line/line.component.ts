import { Component, input } from "@angular/core";
import { Line } from "../../models";
import { WordComponent } from "../word/word.component";

@Component({
  selector: "app-line",
  imports: [WordComponent],
  templateUrl: "./line.component.html",
  styleUrl: "./line.component.scss",
})
export class LineComponent {
  line = input.required<Line>();
}

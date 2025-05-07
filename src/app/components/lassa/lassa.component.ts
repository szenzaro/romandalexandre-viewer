import { Component, input } from "@angular/core";
import { Lassa } from "../../models";
import { VerseComponent } from "../verse/verse.component";

@Component({
  selector: "app-lassa",
  imports: [VerseComponent],
  templateUrl: "./lassa.component.html",
  styleUrl: "./lassa.component.scss",
})
export class LassaComponent {
  lassa = input.required<Lassa>();
}

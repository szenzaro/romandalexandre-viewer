import { Component, input } from "@angular/core";
import { Page } from "../../models";
import { LassaComponent } from "../lassa/lassa.component";
import { NoteComponent } from "../note/note.component";

@Component({
  selector: "app-page",
  imports: [LassaComponent, NoteComponent],
  templateUrl: "./page.component.html",
  styleUrl: "./page.component.scss",
})
export class PageComponent {
  page = input.required<Page>();
}

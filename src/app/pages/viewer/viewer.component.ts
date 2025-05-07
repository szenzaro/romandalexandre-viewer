import { Component } from "@angular/core";
import { PageComponent } from "../../components/page/page.component";
import { mockData } from "../../mockdata";
import { WordsFilterComponent } from "../../components/words-filter/words-filter.component";

@Component({
  selector: "app-viewer",
  imports: [PageComponent, WordsFilterComponent],
  templateUrl: "./viewer.component.html",
  styleUrl: "./viewer.component.scss",
})
export class ViewerComponent {
  pages = mockData; // TODO: change me
}

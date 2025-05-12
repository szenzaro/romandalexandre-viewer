import { Component, inject } from "@angular/core";
import { PageComponent } from "../../components/page/page.component";
import { mockData } from "../../mockdata";
import { WordsFilterComponent } from "../../components/words-filter/words-filter.component";
import { OsdComponent } from "../../components/osd/osd.component";
import { FilterService } from "../../services/filter.service";

@Component({
  selector: "app-viewer",
  imports: [PageComponent, WordsFilterComponent, OsdComponent],
  templateUrl: "./viewer.component.html",
  styleUrl: "./viewer.component.scss",
})
export class ViewerComponent {
  pages = mockData; // TODO: change me
  filterService = inject(FilterService);
}

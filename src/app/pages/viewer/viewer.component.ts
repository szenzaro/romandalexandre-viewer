import { Component, computed, effect, inject, signal } from "@angular/core";
import { PageComponent } from "../../components/page/page.component";
import { WordsFilterComponent } from "../../components/words-filter/words-filter.component";
import { OsdComponent } from "../../components/osd/osd.component";
import { FilterService } from "../../services/filter.service";
import { PageSelectorComponent } from "../../page-selector/page-selector.component";
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-viewer",
  imports: [
    PageComponent,
    WordsFilterComponent,
    OsdComponent,
    PageSelectorComponent,
  ],
  templateUrl: "./viewer.component.html",
  styleUrl: "./viewer.component.scss",
})
export class ViewerComponent {
  filterService = inject(FilterService);
  dataService = inject(DataService);
  
  pages = this.dataService.pages;

  pageIds = computed(() => this.pages().map(({ n }) => n));
  localImages = [
    "osd/manuscript/Ms_Correr_1r.jpg",
    "osd/manuscript/Ms_Correr_1v.jpg",
    "osd/manuscript/Ms_Correr_2r.jpg",
    "osd/manuscript/Ms_Correr_2v.jpg",
    "osd/manuscript/Ms_Correr_3r.jpg",
    "osd/manuscript/Ms_Correr_3v.jpg",
    "osd/manuscript/Ms_Correr_4r.jpg",
    "osd/manuscript/Ms_Correr_4v.jpg",
    "osd/manuscript/Ms_Correr_5r.jpg",
    "osd/manuscript/Ms_Correr_5v.jpg",
    "osd/manuscript/Ms_Correr_6r.jpg",
    "osd/manuscript/Ms_Correr_6v.jpg",
    "osd/manuscript/Ms_Correr_7r.jpg",
    "osd/manuscript/Ms_Correr_7v.jpg",
    "osd/manuscript/Ms_Correr_8r.jpg",
    "osd/manuscript/Ms_Correr_8v.jpg",
    "osd/manuscript/Ms_Correr_9r.jpg",
    "osd/manuscript/Ms_Correr_9v.jpg",
    "osd/manuscript/Ms_Correr_10r.jpg",
    "osd/manuscript/Ms_Correr_10v.jpg",
  ];
  pageId = signal<string>(this.pageIds().at(0) ?? "ERR");
  pageIdEff = effect(() => console.log("pageId" , this.pageId()));
  pageNumber = computed(() => imageToPage(this.pageId(), this.localImages));
  page = computed(() =>
    this.pages().find((p) => p.n === this.pageId()) || this.pages()[0]
  );
}

function imageToPage(id: string, images: string[]) {
  const idx = images.findIndex((url) => url.endsWith(`${id}.jpg`));
  return idx >= 0 ? idx : 0;
}

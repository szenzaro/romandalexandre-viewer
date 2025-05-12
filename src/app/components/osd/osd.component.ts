/*
 *  CophiEditor UI: a collaborative DSL-based web platform for the creation of papyrological critical editions
 *  Copyright (C) 2021 Simone Zenzaro, ILC-CNR
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
 *  USA
 */
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { distinctUntilChanged, filter, map, switchMap } from "rxjs/operators";

import OpenSeadragon from "openseadragon";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";

/*
From:
{
  "@id": "https://www.e-codices.unifr.ch:443/loris/bge/bge-gr0044/bge-gr0044_e001.jp2/full/full/0/default.jpg",
  "@type": "dctypes:Image",
  "format": "image/jpeg",
  "height": 7304,
  "width": 5472,
  "service": {
    "@context": "http://iiif.io/api/image/2/context.json",
    "@id": "https://www.e-codices.unifr.ch/loris/bge/bge-gr0044/bge-gr0044_e001.jp2",
    "profile": "http://iiif.io/api/image/2/level2.json"
  }
}

To:
{
  '@context': 'http://iiif.io/api/image/2/context.json',
  '@id': 'https://www.e-codices.unifr.ch/loris/bge/bge-gr0044/bge-gr0044_e001.jp2',
  'profile': ['http://iiif.io/api/image/2/level2.json'],
  'protocol': 'http://iiif.io/api/image',
  'height': 7304,
  'width': 5472,
}
*/
function manifestResourcetoTileSource(
  manifestResource: { service: { [x: string]: any }; height: any; width: any },
) { // TODO: check if there is a manifest type already defined
  const a = manifestResource.service["@id"] as string;
  return {
    "@context": manifestResource.service["@context"],
    "@id": a.slice(-1) === "/" ? a.slice(0, a.length - 1) : a,
    profile: [manifestResource.service["@profile"]],
    protocol: "http://iiif.io/api/image",
    height: manifestResource.height,
    width: manifestResource.width,
  };
}

@Component({
  selector: "app-osd",
  imports: [],
  templateUrl: "./osd.component.html",
  styleUrl: "./osd.component.scss",
})
export class OsdComponent {
  #http = inject(HttpClient);

  #commonOptions: OpenSeadragon.Options = {
    visibilityRatio: 0.1,
    minZoomLevel: 0.5,
    defaultZoomLevel: 1,
    sequenceMode: true,
    showRotationControl: true,
    prefixUrl:"/osd/images/",
    navigatorBackground: "#606060",
    showNavigator: false,
    gestureSettingsMouse: {
      clickToZoom: false,
      dblClickToZoom: true,
    },
  };

  options = input<OpenSeadragon.Options>({});
  sourceType = input<"manifest" | "local">("local");
  manifestURL = input<string>("");
  localImages = input<string[]>([
    "osd/manuscript/Ms_Correr_1r.jpg",
    "/osd/manuscript/Ms_Correr_1r.jpg",
    "http://localhost:4200/osd/manuscript/Ms_Correr_1r.jpg",
    "http://localhost:4200/osd/manuscript/Ms_Correr_1v.jpg",
  ]);

  page = signal(0);
  viewer = signal<OpenSeadragon.Viewer | undefined>(undefined);

  el = viewChild.required<ElementRef<HTMLDivElement>>("osdElem");

  #instanceOptions = computed(() => ({
    ...this.#commonOptions,
    ...this.options(),
    element: this.el().nativeElement,
    showFullPageControl: false,
    // tileSources: { type: "image", url:"/osd/manuscript/Ms_Correr_1r.jpg"},
    tileSources: this.tileSources(),
    initialPage: this.page(),
  }));

  createViewerEffect = effect(() => {
    if (this.tileSources() === undefined) {
      return;
    }
    const opts = this.#instanceOptions();

    untracked(() => {
      this.viewer()?.destroy(); //if exsist, cleanup old viewer

      const v = OpenSeadragon(opts);
      v.addHandler("page", ({ page }) => this.page.set(page)); // TODO: add handler cleanup on destroy
      v.element.style.position = "absolute";
      // this.viewer.addHandler('open', () => {
      //   let printButton = new Button({
      //     tooltip: 'Print',
      //     srcRest: `/assets/osd/colors_invert_icon.png`,
      //     srcGroup: `/assets/osd/colors_invert_icon.png`,
      //     srcHover: `/assets/osd/colors_invert_icon.png`,
      //     srcDown: `/assets/osd/colors_invert_icon.png`,
      //     onClick: () => alert('hello'),
      //   });

      //   this.viewer.addControl(printButton.element, { anchor: ControlAnchor.TOP_LEFT });
      // });

      this.viewer.set(v);
      console.log(v)
    });
  });

  localImagesTileSources = computed(() => ({
    type: "image",
    url: this.localImages()[0],
  }));
  manifestTileSources = toSignal<OpenSeadragon.TileSource[]>( // TODO: change to resource when upgraded to angular 19
    toObservable(this.manifestURL).pipe(
      filter((url) => !!url),
      distinctUntilChanged(),
      switchMap((url) =>
        this.#http.get<{ sequences: Partial<Array<{ canvases: any[] }>> }>(
          url!,
        )
      ), // TODO: check  if there is an already defined type for manifest
      map((manifest) =>
        manifest // get the resource fields in the manifest json structure
          .sequences.map((seq) =>
            seq!.canvases.map((canv) => canv.images).reduce(
              (x, y) => x.concat(y),
              [],
            )
          ) // TODO: check if seq can be undefined
          .reduce((x, y) => x.concat(y), []).map((res: { resource: any }) =>
            res.resource
          ) // TODO: check if there is an already defined type for res
          .map(manifestResourcetoTileSource)
      ),
    ),
  );

  tileSources = computed(() =>
    this.sourceType() === "local"
      ? this.localImages() ?? []
      : this.manifestTileSources() ?? []
  );

  constructor(
    private elRef: ElementRef,
  ) {
  }
}

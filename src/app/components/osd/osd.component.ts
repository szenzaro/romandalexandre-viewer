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
  input,
  model,
  signal,
  untracked,
} from "@angular/core";

import { httpResource } from "@angular/common/http";
import OpenSeadragon from "openseadragon";

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
  templateUrl: "./osd.component.html",
  styleUrls: ["./osd.component.scss"],
})
export class OsdComponent {
  #commonOptions: OpenSeadragon.Options;

  options = input<OpenSeadragon.Options>({});
  manifestURL = input<string>();
  sourceType = input<"local" | "manifest">("local");

  page = model(0);
  viewer = signal<OpenSeadragon.Viewer | undefined>(undefined);

  #instanceOptions = computed(() => ({
    ...this.#commonOptions,
    ...this.options(),
    showFullPageControl: false,
    showSequenceControl: false,
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
      this.viewer.set(v);
    });
  });

  manifestResource = httpResource<
    { sequences: Partial<Array<{ canvases: any[] }>> }
  >(() => this.manifestURL());
  manifestTileSources = computed(() => {
    const v = this.manifestResource.value();
    if (v === undefined) {
      return [];
    }

    return v.sequences.map((seq) =>
      seq!.canvases.map((canv) => canv.images).reduce(
        (x, y) => x.concat(y),
        [],
      )
    ) // TODO: check if seq can be undefined
      .reduce((x, y) => x.concat(y), []).map((res: { resource: any }) =>
        res.resource
      ) // TODO: check if there is an already defined type for res
      .map(manifestResourcetoTileSource);
  });

  localImages = input<string[]>([]);
  localTileSources = computed(() => this.localImages().map(urlToTileSource));

  tileSources = computed(() => {
    if (this.sourceType() === "local") {
      return this.localTileSources();
    }
    return this.manifestTileSources();
  });

  constructor(
    private elRef: ElementRef,
  ) {
    this.#commonOptions = {
      visibilityRatio: 0.1,
      minZoomLevel: 0.5,
      defaultZoomLevel: 1,
      sequenceMode: true,
      showRotationControl: true,
      prefixUrl: "/osd/images/",
      element: this.elRef.nativeElement,
      navigatorBackground: "#606060",
      showNavigator: false,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: true,
      },
    };
  }
}

function urlToTileSource(url: string) {
  return {
    type: "image",
    url,
  };
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeHtml'
})
export class DecodeHtmlPipe implements PipeTransform {

  transform(value: string) {
    const txt = document.createElement('div');
    txt.innerHTML = value;
    return txt.innerText;
  }

}

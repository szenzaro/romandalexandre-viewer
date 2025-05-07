import { Component, input } from '@angular/core';
import { Verse } from '../../models';
import { LineComponent } from "../line/line.component";

@Component({
  selector: 'app-verse',
  imports: [LineComponent],
  templateUrl: './verse.component.html',
  styleUrl: './verse.component.scss'
})
export class VerseComponent {
  verse = input.required<Verse>();
}

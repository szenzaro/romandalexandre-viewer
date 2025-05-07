import { Component, input } from '@angular/core';
import { Note } from '../../models';
import { LineComponent } from "../line/line.component";

@Component({
  selector: 'app-note',
  imports: [LineComponent],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  note = input.required<Note>()
}

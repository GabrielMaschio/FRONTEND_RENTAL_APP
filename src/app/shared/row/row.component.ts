import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [],
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss'
})
export class RowComponent {
  @Input() text: string = "";
  @Input() span: string = "";

  @Output("navigate") onNavigate = new EventEmitter();

  navigate() {
    this.onNavigate.emit();
  }
}

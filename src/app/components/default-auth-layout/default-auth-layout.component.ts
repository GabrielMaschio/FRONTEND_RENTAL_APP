import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RowComponent } from "../../shared/row/row.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-auth-layout',
  standalone: true,
  imports: [RowComponent],
  templateUrl: './default-auth-layout.component.html',
  styleUrl: './default-auth-layout.component.scss'
})
export class DefaultAuthLayoutComponent {

  constructor(private router: Router) {}

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() primaryBtnText: string = "";
  @Input() rowText: string = "";
  @Input() rowSpan: string = "";
  @Input() page: string = "";
  @Input() disablePrimaryButton: boolean = true;

  @Output("submit") onSubmit = new EventEmitter();

  submit() {
    this.onSubmit.emit();
  }

  navigate() {
    this.router.navigate([this.page]);
  }
}

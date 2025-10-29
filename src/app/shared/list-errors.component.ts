import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ListErrorsComponent {
  formattedErrors = signal<string[]>([]);

  @Input()
  set errors(errorList: string[] | null) {
    this.formattedErrors.set(errorList?.map(error => `${error}`) || []);
  }

  get errorList(): string[] { return this.formattedErrors(); }
}
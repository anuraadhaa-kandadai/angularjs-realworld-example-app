import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-pagination',
  templateUrl: './list-pagination.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ListPaginationComponent {
  @Input() totalPages: number[] = [];
  @Input() currentPage: number = 1;
  @Output() setPage = new EventEmitter<number>();

  setPageTo(pageNumber: number) {
    this.setPage.emit(pageNumber);
  }
}
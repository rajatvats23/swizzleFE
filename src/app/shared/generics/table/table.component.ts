import { Component, Input, output, ViewEncapsulation, signal, computed, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface PaginationConfig {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface SortConfig {
  active: string;
  direction: 'asc' | 'desc' | '';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule 
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent {
  // Inputs
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() isLoading = true;
  
  // Two-way binding for pagination using model()
  pagination = model<PaginationConfig>({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0
  });
  
  // Two-way binding for sorting using model()
  sorting = model<SortConfig>({
    active: '',
    direction: ''
  });
  
  // Available page sizes
  pageSizeOptions = [5, 10, 25, 50, 100];
  
  // Outputs using the output() function
  edit = output<any>();
  delete = output<any>();
  sort = output<Sort>();
  page = output<PageEvent>();
  
  // Computed properties
  columnsWithoutActions = computed(() => {
    return this.displayedColumns.filter(col => col !== 'actions');
  });
  
  hasActions = computed(() => {
    return this.displayedColumns.includes('actions');
  });
  
  // Helper methods
  formatColumnHeader(column: string): string {
    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
  
  isLongContent(content: any): boolean {
    if (typeof content !== 'string') {
      return false;
    }
    return content.length > 50;
  }
  
  // Handlers for pagination and sorting
  onPageChange(event: PageEvent): void {
    this.pagination.update(prev => ({
      ...prev,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    }));
    
    this.page.emit(event);
  }
  
  onSortChange(event: Sort): void {
    this.sorting.update(() => ({
      active: event.active,
      direction: event.direction
    }));
    
    this.sort.emit(event);
  }
}
// generic-table.component.ts
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from '../../shared.module';
import { AdvancedFilterComponent } from '../advanced-filter/advanced-filter.component';

export interface TableColumn<T> {
  name: string;
  header: string;
  cell: (element: T) => string;
  sortable?: boolean;
  filterable?: boolean;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    SharedModule,
    AdvancedFilterComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class GenericTableComponent<T> implements OnInit, AfterViewInit {
  @Input() title = 'Data Table';
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showPaginator = true;
  @Input() showFilter = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  isAdvancedFilterOpen = false;

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(column => column.name);
    this.updateData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom sorting logic to work with our cell accessor functions
    this.dataSource.sortingDataAccessor = (item: T, columnId: string) => {
      const column = this.columns.find(col => col.name === columnId);
      if (column) {
        const cellValue = column.cell(item);
        // Convert to number if possible for proper numeric sorting
        const numValue = Number(cellValue);
        return isNaN(numValue) ? cellValue.toLowerCase() : numValue;
      }
      return '';
    };
  }

  updateData(): void {
    this.dataSource.data = [...this.data];
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCellValue(row: T, column: TableColumn<T>): string {
    return column.cell(row);
  }
  
  toggleAdvancedFilter(): void {
    this.isAdvancedFilterOpen = !this.isAdvancedFilterOpen;
  }
  
  closeAdvancedFilter(): void {
    this.isAdvancedFilterOpen = false;
  }
  
  applyAdvancedFilters(filters: any): void {
    console.log('Applied filters:', filters);
    // Here you would implement the actual filtering logic based on the advanced filters
    // This is just a placeholder for demonstration
    
    // Example of custom filter predicate
    this.dataSource.filterPredicate = (data: T, filter: string) => {
      // This is where you'd implement the advanced filtering logic
      // For now, we'll just use the default behavior
      return true;
    };
    
    // Trigger filtering
    this.dataSource.filter = JSON.stringify(filters);
  }
}
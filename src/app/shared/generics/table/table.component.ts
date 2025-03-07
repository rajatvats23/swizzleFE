import { Component, Input, output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent {
  // Inputs
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  
  // Outputs using the new output() function
  edit = output<any>();
  delete = output<any>();
  
  // Computed properties
  get columnsWithoutActions(): string[] {
    return this.displayedColumns.filter(col => col !== 'actions');
  }
  
  get hasActions(): boolean {
    return this.displayedColumns.includes('actions');
  }
  
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
}
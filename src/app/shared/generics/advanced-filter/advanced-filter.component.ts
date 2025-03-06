// advanced-filter-drawer.component.ts
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-advanced-filter-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule
  ],
  templateUrl: './advanced-filter.component.html',
  styleUrl: './advanced-filter.component.scss'
})
export class AdvancedFilterComponent {
  @Input() isOpen = false;
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() applyFilters = new EventEmitter<any>();
  
  filterForm: FormGroup;
  statusOptions = ['Active', 'Inactive', 'Pending', 'Completed'];
  categoryOptions = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  priorityOptions = ['High', 'Medium', 'Low'];
  selectedCategories: string[] = [];
  
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      status: [''],
      priority: [''],
      minAmount: [''],
      maxAmount: ['']
    });
  }
  
  addCategory(category: string): void {
    if (!this.selectedCategories.includes(category)) {
      this.selectedCategories.push(category);
    }
  }
  
  removeCategory(category: string): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== category);
  }
  
  onClose(): void {
    this.closeDrawer.emit();
  }
  
  onApply(): void {
    const filters = {
      ...this.filterForm.value,
      categories: [...this.selectedCategories]
    };
    this.applyFilters.emit(filters);
    this.closeDrawer.emit();
  }
  
  onReset(): void {
    this.filterForm.reset();
    this.selectedCategories = [];
  }
}
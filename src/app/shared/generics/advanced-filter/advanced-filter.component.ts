// advanced-filter.component.ts
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  name?: boolean;
  status?: FilterOption[];
  categories?: FilterOption[];
  priority?: FilterOption[];
  dateRange?: boolean;
  amountRange?: boolean;
}

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
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './advanced-filter.component.html',
  styleUrl: './advanced-filter.component.scss'
})
export class AdvancedFilterComponent implements OnInit {
  @Input() isOpen = false;
  @Input() config: FilterConfig = {
    name: true,
    status: [],
    categories: [],
    priority: [],
    dateRange: false,
    amountRange: false
  };
  
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() applyFilters = new EventEmitter<any>();
  
  filterForm: FormGroup;
  selectedCategories: string[] = [];
  
  get statusOptions(): FilterOption[] {
    return this.config.status || [];
  }
  
  get categoryOptions(): FilterOption[] {
    return this.config.categories || [];
  }
  
  get priorityOptions(): FilterOption[] {
    return this.config.priority || [];
  }
  
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      status: [''],
      priority: [''],
      minAmount: [''],
      maxAmount: [''],
      startDate: [''],
      endDate: ['']
    });
  }
  
  ngOnInit(): void {
    // Build form based on config
    const formControls: any = {};
    
    if (this.config.name) {
      formControls.name = [''];
    }
    
    if (this.config.status && this.config.status.length > 0) {
      formControls.status = [''];
    }
    
    if (this.config.priority && this.config.priority.length > 0) {
      formControls.priority = [''];
    }
    
    if (this.config.dateRange) {
      formControls.startDate = [''];
      formControls.endDate = [''];
    }
    
    if (this.config.amountRange) {
      formControls.minAmount = [''];
      formControls.maxAmount = [''];
    }
    
    this.filterForm = this.fb.group(formControls);
  }
  
  addCategory(category: string): void {
    if (!this.selectedCategories.includes(category)) {
      this.selectedCategories.push(category);
    }
  }
  
  removeCategory(category: string): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== category);
  }
  
  getCategoryLabel(value: string): string {
    const option = this.categoryOptions.find(opt => opt.value === value);
    return option ? option.label : value;
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
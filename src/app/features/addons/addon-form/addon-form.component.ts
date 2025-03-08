// src/app/features/addons/addon-form/addon-form.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { 
  FormBuilder, 
  FormControl, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatChipsModule, MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatDividerModule } from "@angular/material/divider";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, finalize, map, startWith, firstValueFrom, forkJoin } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { AddonService } from "../../../services/addon.service";
import { ImageUploadService } from "../../../services/image-upload.service";
import { CategoryService } from "../../../services/category.service";
import { ProductService } from "../../../services/product.service";
import { Addon, AddonCreate, AddonUpdate } from "../../../shared/interfaces/addon.interface";
import { Category } from "../../../shared/interfaces/category.interface";
import { Product } from "../../../shared/interfaces/product.interface";

@Component({
  selector: "app-addon-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDividerModule
  ],
  templateUrl: './addon-form.component.html',
  styleUrl: './addon-form.component.scss',
})
export class AddonFormComponent implements OnInit {
  // Dependency injection
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private addonService = inject(AddonService);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private imageUploadService = inject(ImageUploadService);
  private snackBar = inject(MatSnackBar);

  // State signals
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  uploading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  categories = signal<Category[]>([]);
  allProducts = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  selectedProducts = signal<Product[]>([]);
  imageUrl: string = '';
  
  // ViewChild for product input
  @ViewChild('productInput') productInput!: ElementRef<HTMLInputElement>;
  
  // Chip list for product selection
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  productCtrl = new FormControl('');
  filteredProductsObservable!: Observable<Product[]>;
  
  // Form controls
  addonForm: FormGroup;

  constructor() {
    this.addonForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      selectionType: ['single', [Validators.required]],
      addonType: ['topping', [Validators.required]],
      categoryId: ['all'], // Default to 'all' categories
      applicableProducts: [[] as string[], [Validators.required]], // Store product IDs as array
      isActive: [true]
    });
    
    // Setup category change listener in constructor (proper injection context)
    this.addonForm.get('categoryId')?.valueChanges.subscribe(categoryId => {
      if (categoryId === 'all') {
        this.loadAllProducts();
      } else {
        this.loadProductsByCategory(categoryId);
      }
    });
  }

  ngOnInit(): void {
    // Load categories and products
    this.loadCategories();
    
    // Check if we're in edit mode
    const addonId = this.route.snapshot.paramMap.get('id');
    if (addonId) {
      this.isEditMode.set(true);
      this.loadAddon(addonId);
    } else {
      // For create mode, load all products
      this.loadAllProducts();
    }
    
    // Set up product filtering
    this.setupProductFiltering();
  }

  loadCategories(): void {
    this.categoryService.getCategories({ limit: 100 }).subscribe({
      next: (response) => {
        this.categories.set(response.data as Category[]);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
      }
    });
  }

  loadAllProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (response) => {
        this.allProducts.set(response.data);
        this.filteredProducts.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
        this.snackBar.open('Failed to load products', 'Close', { duration: 3000 });
      }
    });
  }

  loadProductsByCategory(categoryId: string): void {
    this.isLoading.set(true);
    this.productService.getProducts({ categoryId, limit: 100 }).subscribe({
      next: (response) => {
        this.filteredProducts.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products by category:', error);
        this.isLoading.set(false);
        this.snackBar.open('Failed to load products for selected category', 'Close', { duration: 3000 });
      }
    });
  }

  setupProductFiltering(): void {
    this.filteredProductsObservable = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProducts(value || ''))
    );
  }

  private _filterProducts(value: string): Product[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    
    // Filter from filteredProducts (which changes based on category selection)
    return this.filteredProducts()
      .filter(product => 
        // Exclude already selected products
        !this.selectedProducts().some(p => p._id === product._id) && 
        // Match by name
        product.name.toLowerCase().includes(filterValue)
      );
  }

  loadAddon(id: string): void {
    this.isLoading.set(true);
    
    this.addonService.getAddonById(id).subscribe({
      next: (addon) => {
        this.patchAddonForm(addon);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading addon:', error);
        this.isLoading.set(false);
        this.snackBar.open('Failed to load addon details. Please try again.', 'Close', { duration: 5000 });
        this.navigateBack();
      }
    });
  }

  patchAddonForm(addon: Addon): void {
    // Set image URL
    this.imageUrl = addon.imageUrl || '';
    
    console.log('Patching addon form with data:', addon);
    
    // Ensure applicableProducts is an array of strings (IDs)
    let applicableProductIds: string[] = [];
    
    if (addon.applicableProducts && addon.applicableProducts.length > 0) {
      // Ensure we have string IDs, not objects
      applicableProductIds = (addon.applicableProducts as (Product | string)[]).map((product) => {
        if (typeof product === 'string') {
          return product;
        } else if ((product as Product)._id) {
          return product._id;
        } else {
          console.warn('Invalid product format:', product);
          return '';
        }
      }).filter(id => id !== ''); // Remove any empty IDs
    }
    
    console.log('Extracted product IDs:', applicableProductIds);
    
    // Patch basic fields
    this.addonForm.patchValue({
      name: addon.name,
      description: addon.description,
      price: addon.price,
      selectionType: addon.selectionType,
      addonType: addon.addonType,
      isActive: addon.isActive,
      // Update the applicableProducts field with string IDs
      applicableProducts: applicableProductIds
    });
    
    // Load applicable products by ID
    if (applicableProductIds.length > 0) {
      this.loadApplicableProducts(applicableProductIds);
    }
  }

  loadApplicableProducts(productIds: string[]): void {
    this.isLoading.set(true);
    
    // Log the product IDs we're trying to load
    console.log('Loading applicable products with IDs:', productIds);
    
    // Ensure we have valid string IDs
    const validProductIds = productIds.filter(id => typeof id === 'string' && id.trim() !== '');
    
    if (validProductIds.length === 0) {
      console.warn('No valid product IDs found after filtering');
      this.isLoading.set(false);
      return;
    }
    
    // Load all products first
    this.productService.getProducts({ limit: 500 }).subscribe({
      next: (response) => {
        const allProducts = response.data;
        console.log('All products loaded:', allProducts.length);
        this.allProducts.set(allProducts);
        this.filteredProducts.set(allProducts);
        
        // Find selected products from all products
        const selected = allProducts.filter(product => {
          const isSelected = validProductIds.includes(product._id);
          if (isSelected) {
            console.log('Found matching product:', product.name, product._id);
          }
          return isSelected;
        });
        
        console.log('Selected products:', selected);
        
        if (selected.length === 0) {
          console.warn('No matching products found. Product IDs:', validProductIds);
          
          // Try fetching specific products by ID as a fallback
          this.fetchProductsById(validProductIds);
        } else {
          // Set the selected products
          this.selectedProducts.set(selected);
          
          // Make sure form value is updated
          this.addonForm.get('applicableProducts')?.setValue(validProductIds);
          
          // Manually trigger validation
          this.addonForm.get('applicableProducts')?.updateValueAndValidity();
        }
        
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading applicable products:', error);
        this.isLoading.set(false);
        this.snackBar.open('Failed to load selected products', 'Close', { duration: 3000 });
      }
    });
  }
  
  // Fallback method to fetch products by ID individually
  async fetchProductsById(productIds: string[]): Promise<void> {
    if (productIds.length === 0) return;
    
    this.isLoading.set(true);
    
    try {
      // Create an array of observables for each product request
      const fetchedProducts: Product[] = [];
      
      // Instead of forkJoin, use sequential requests to avoid overwhelming the API
      for (const id of productIds) {
        try {
          const product = await firstValueFrom(this.productService.getProductById(id));
          if (product) {
            console.log('Successfully fetched product:', product.name);
            fetchedProducts.push(product);
          }
        } catch (err) {
          console.error(`Error fetching product ID ${id}:`, err);
        }
      }
      
      console.log('Fetched products by ID:', fetchedProducts);
      
      if (fetchedProducts.length > 0) {
        this.selectedProducts.set(fetchedProducts);
        // Update the form value with IDs of successfully fetched products
        this.addonForm.get('applicableProducts')?.setValue(fetchedProducts.map(p => p._id));
      }
    } catch (error) {
      console.error('Error in fetchProductsById:', error);
      this.snackBar.open('Failed to load some product details', 'Close', { duration: 3000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  private uploadImage(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Only image files are allowed', 'Close', { duration: 3000 });
      return;
    }

    // Upload the file
    this.uploading.set(true);
    this.imageUploadService.uploadImage(file, 'addons')
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: (response) => {
          this.imageUrl = response.url;
          this.snackBar.open('Image uploaded successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open(`Error uploading image: ${error.message}`, 'Close', { duration: 5000 });
        }
      });
  }

  removeProduct(product: Product): void {
    const currentSelected = this.selectedProducts();
    const updated = currentSelected.filter(p => p._id !== product._id);
    this.selectedProducts.set(updated);
    
    // Update the form control value
    const productIds = updated.map(p => p._id);
    this.addonForm.get('applicableProducts')?.setValue(productIds);
    
    // Re-filter available products
    this.productCtrl.updateValueAndValidity();
  }

  selectProduct(event: MatAutocompleteSelectedEvent): void {
    const selectedProduct = event.option.value as Product;
    const currentSelected = this.selectedProducts();
    
    // Add only if not already in the list
    if (!currentSelected.some(p => p._id === selectedProduct._id)) {
      const updated = [...currentSelected, selectedProduct];
      this.selectedProducts.set(updated);
      
      // Update the form control value
      const productIds = updated.map(p => p._id);
      this.addonForm.get('applicableProducts')?.setValue(productIds);
    }
    
    // Clear the input
    this.productInput.nativeElement.value = '';
    this.productCtrl.setValue('');
  }

  navigateBack(): void {
    this.router.navigate(['/addons']);
  }

  onSubmit(): void {
    if (this.addonForm.invalid || this.isSubmitting() || this.uploading()) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.addonForm);
      return;
    }
    
    this.isSubmitting.set(true);
    
    // Get form value
    const formValue = this.addonForm.value;
    
    // Build the addon object
    const addon: AddonCreate | AddonUpdate = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      selectionType: formValue.selectionType,
      addonType: formValue.addonType,
      applicableProducts: formValue.applicableProducts
    };
    
    // Only include imageUrl if it exists
    if (this.imageUrl) {
      addon.imageUrl = this.imageUrl;
    }
    
    if (this.isEditMode()) {
      (addon as AddonUpdate).isActive = formValue.isActive;
    }
    
    // Update or create the addon
    if (this.isEditMode()) {
      const addonId = this.route.snapshot.paramMap.get('id') as string;
      this.addonService.updateAddon(addonId, addon as AddonUpdate)
        .subscribe({
          next: () => {
            this.snackBar.open('Add-on updated successfully', 'Close', { duration: 3000 });
            this.isSubmitting.set(false);
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error updating add-on:', error);
            this.isSubmitting.set(false);
            this.snackBar.open('Failed to update add-on. Please try again.', 'Close', { duration: 5000 });
          }
        });
    } else {
      this.addonService.createAddon(addon as AddonCreate)
        .subscribe({
          next: () => {
            this.snackBar.open('Add-on created successfully', 'Close', { duration: 3000 });
            this.isSubmitting.set(false);
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error creating add-on:', error);
            this.isSubmitting.set(false);
            this.snackBar.open('Failed to create add-on. Please try again.', 'Close', { duration: 5000 });
          }
        });
    }
  }
  
  // Recursively mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // Display function for mat-autocomplete
  displayFn(product: Product): string {
    return product && product.name ? product.name : '';
  }
}
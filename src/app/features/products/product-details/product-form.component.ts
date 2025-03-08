// src/app/features/products/product-form/product-form.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBar } from "@angular/material/snack-bar";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { finalize } from "rxjs";

import { ProductService } from "../../../services/product.service";
import { CategoryService } from "../../../services/category.service";
import { ImageUploadService } from "../../../services/image-upload.service";
import { 
  Product, 
  Variant, 
  ProductCreate,
  ProductUpdate,
  NutritionalInfo
} from "../../../shared/interfaces/product.interface";
import { Category } from "../../../shared/interfaces/category.interface";

@Component({
  selector: "app-product-form",
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
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatAutocompleteModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  // Dependency injection
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private imageUploadService = inject(ImageUploadService);
  private snackBar = inject(MatSnackBar);

  // State signals
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  uploading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  categories = signal<Category[]>([]);
  mainImageUrl: string = '';
  thumbnailUrl: string = '';
  
  // Chip list for ingredients
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // Main form
  productForm: FormGroup;

  // Getters for form arrays to use in template
  get variantsArray() {
    return this.productForm.get('variants') as FormArray;
  }
  
  get ingredientsArray() {
    return this.productForm.get('ingredients') as FormArray;
  }

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      categoryId: [''],
      preparationTime: [15, [Validators.min(0)]],
      ingredients: this.fb.array([]),
      nutritionalInfo: this.fb.group({
        calories: [0, [Validators.min(0)]],
        protein: [0, [Validators.min(0)]],
        carbs: [0, [Validators.min(0)]],
        fat: [0, [Validators.min(0)]],
        fiber: [0, [Validators.min(0)]]
      }),
      variants: this.fb.array([]),
      isVegetarian: [false],
      isVegan: [false],
      isGlutenFree: [false],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    // Load categories
    this.loadCategories();
    
    // Check if we're in edit mode
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditMode.set(true);
      this.loadProduct(productId);
    } else {
      // For create mode, add an initial variant
      this.addVariant();
    }
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

  loadProduct(id: string): void {
    this.isLoading.set(true);
    
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.patchProductForm(product);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading.set(false);
        this.snackBar.open('Failed to load product details. Please try again.', 'Close', { duration: 5000 });
        this.navigateBack();
      }
    });
  }

  patchProductForm(product: Product): void {
    // Clear existing form arrays
    while (this.variantsArray.length) {
      this.variantsArray.removeAt(0);
    }
    
    while (this.ingredientsArray.length) {
      this.ingredientsArray.removeAt(0);
    }
    
    // Set image URLs
    this.mainImageUrl = product.imageUrl;
    this.thumbnailUrl = product.thumbnailUrl || '';
    
    // Get category ID
    let categoryId = '';
    if (product.categoryId) {
      categoryId = typeof product.categoryId === 'string' 
        ? product.categoryId 
        : product.categoryId._id;
    }
    
    // Patch basic fields
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      categoryId: categoryId,
      preparationTime: product.preparationTime || 15,
      nutritionalInfo: product.nutritionalInfo || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      },
      isVegetarian: product.isVegetarian,
      isVegan: product.isVegan,
      isGlutenFree: product.isGlutenFree,
      isActive: product.isActive
    });
    
    // Add variants
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        this.variantsArray.push(this.createVariantGroup(variant));
      });
    } else {
      // Add a default variant if none exist
      this.addVariant();
    }
    
    // Add ingredients
    if (product.ingredients && product.ingredients.length > 0) {
      product.ingredients.forEach(ingredient => {
        this.ingredientsArray.push(this.fb.control(ingredient));
      });
    }
  }

  createVariantGroup(variant?: Variant): FormGroup {
    return this.fb.group({
      name: [variant?.name || '', [Validators.required]],
      price: [variant?.price || this.productForm.get('basePrice')?.value || 0, [Validators.required, Validators.min(0)]],
      isDefault: [variant?.isDefault || false]
    });
  }

  addVariant(): void {
    this.variantsArray.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    // Check if we're removing the default variant
    const wasDefault = this.variantsArray.at(index).get('isDefault')?.value;
    
    this.variantsArray.removeAt(index);
    
    // If we removed the default variant and we have other variants, set the first one as default
    if (wasDefault && this.variantsArray.length > 0) {
      this.variantsArray.at(0).get('isDefault')?.setValue(true);
    }
  }

  setAsDefaultVariant(index: number): void {
    // If setting this variant as default, unset all others
    const isDefault = this.variantsArray.at(index).get('isDefault')?.value;
    
    if (isDefault) {
      for (let i = 0; i < this.variantsArray.length; i++) {
        if (i !== index) {
          this.variantsArray.at(i).get('isDefault')?.setValue(false);
        }
      }
    }
  }

  addIngredient(event: any): void {
    const value = (event.value || '').trim();
    
    if (value) {
      this.ingredientsArray.push(this.fb.control(value));
    }
    
    // Clear the input
    event.chipInput!.clear();
  }

  removeIngredient(index: number): void {
    this.ingredientsArray.removeAt(index);
  }

  onMainImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadImage(file, 'main');
    }
  }

  onThumbnailSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadImage(file, 'thumbnail');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent, imageType: 'main' | 'thumbnail'): void {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.uploadImage(file, imageType);
    }
  }

  private uploadImage(file: File, imageType: 'main' | 'thumbnail'): void {
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Only image files are allowed', 'Close', { duration: 3000 });
      return;
    }

    // Upload the file
    this.uploading.set(true);
    this.imageUploadService.uploadImage(file, 'products')
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: (response) => {
          // Set the image URL based on type
          if (imageType === 'main') {
            this.mainImageUrl = response.url;
          } else {
            this.thumbnailUrl = response.url;
          }
          this.snackBar.open('Image uploaded successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open(`Error uploading image: ${error.message}`, 'Close', { duration: 5000 });
        }
      });
  }

  navigateBack(): void {
    this.router.navigate(['/products']);
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.isSubmitting() || this.uploading()) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.productForm);
      return;
    }
    
    if (!this.mainImageUrl) {
      this.snackBar.open('Main product image is required', 'Close', { duration: 3000 });
      return;
    }
    
    this.isSubmitting.set(true);
    
    // Get form value
    const formValue = this.productForm.value;
    
    // Ensure at least one variant has isDefault = true
    if (formValue.variants.length > 0 && !formValue.variants.some((v: Variant) => v.isDefault)) {
      formValue.variants[0].isDefault = true;
    }
    
    // Build the product object
    const product: ProductCreate | ProductUpdate = {
      name: formValue.name,
      description: formValue.description,
      basePrice: formValue.basePrice,
      imageUrl: this.mainImageUrl,
      thumbnailUrl: this.thumbnailUrl || undefined,
      categoryId: formValue.categoryId || undefined,
      preparationTime: formValue.preparationTime,
      ingredients: formValue.ingredients,
      nutritionalInfo: formValue.nutritionalInfo,
      variants: formValue.variants,
      isVegetarian: formValue.isVegetarian,
      isVegan: formValue.isVegan,
      isGlutenFree: formValue.isGlutenFree,
    };
    
    if (this.isEditMode()) {
      (product as ProductUpdate).isActive = formValue.isActive;
    }
    
    // Update or create the product
    if (this.isEditMode()) {
      const productId = this.route.snapshot.paramMap.get('id') as string;
      this.productService.updateProduct(productId, product as ProductUpdate)
        .subscribe({
          next: () => {
            this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
            this.isSubmitting.set(false);
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.isSubmitting.set(false);
            this.snackBar.open('Failed to update product. Please try again.', 'Close', { duration: 5000 });
          }
        });
    } else {
      this.productService.createProduct(product as ProductCreate)
        .subscribe({
          next: () => {
            this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
            this.isSubmitting.set(false);
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error creating product:', error);
            this.isSubmitting.set(false);
            this.snackBar.open('Failed to create product. Please try again.', 'Close', { duration: 5000 });
          }
        });
    }
  }
  
  // Recursively mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
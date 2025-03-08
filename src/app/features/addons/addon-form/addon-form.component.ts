// // src/app/features/addons/addon-form/addon-form.component.ts
// import { CommonModule } from "@angular/common";
// import { Component, inject, OnInit, signal } from "@angular/core";
// import { ActivatedRoute, Router } from "@angular/router";
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
// import { MatCardModule } from "@angular/material/card";
// import { MatButtonModule } from "@angular/material/button";
// import { MatIconModule } from "@angular/material/icon";
// import { MatInputModule } from "@angular/material/input";
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatProgressBarModule } from "@angular/material/progress-bar";
// import { MatSlideToggleModule } from "@angular/material/slide-toggle";
// import { MatSnackBar } from "@angular/material/snack-bar";

// import { AddonService } from "../../../services/addon.service";
// import { AddOn, AddOnCreate, AddOnUpdate } from "../../../shared/interfaces/product.interface";

// @Component({
//   selector: "app-addon-form",
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatCardModule,
//     MatButtonModule,
//     MatIconModule,
//     MatInputModule,
//     MatFormFieldModule,
//     MatProgressBarModule,
//     MatSlideToggleModule
//   ],
//   templateUrl: './addon-form.component.html',
//   styleUrl: './addon-form.component.scss',
// })
// export class AddonFormComponent implements OnInit {
//   // Dependency injection
//   private fb = inject(FormBuilder);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private addonService = inject(AddonService);
//   private snackBar = inject(MatSnackBar);

//   // State signals
//   isLoading = signal<boolean>(false);
//   isSubmitting = signal<boolean>(false);
//   isEditMode = signal<boolean>(false);
  
//   // Form
//   addonForm: FormGroup;

//   constructor() {
//     this.addonForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       price: [0, [Validators.required, Validators.min(0)]],
//       description: [''],
//       isActive: [true]
//     });
//   }

//   ngOnInit(): void {
//     // Check if we're in edit mode
//     const addonId = this.route.snapshot.paramMap.get('id');
//     if (addonId) {
//       this.isEditMode.set(true);
//       this.loadAddon(addonId);
//     }
//   }

//   loadAddon(id: string): void {
//     this.isLoading.set(true);
    
//     this.addonService.getAddons().subscribe({
//       next: (addons) => {
//         const addon = addons.find(a => a._id === id);
        
//         if (addon) {
//           this.patchAddonForm(addon);
//         } else {
//           this.snackBar.open('Add-on not found', 'Close', { duration: 3000 });
//           this.navigateBack();
//         }
        
//         this.isLoading.set(false);
//       },
//       error: (error) => {
//         console.error('Error loading add-on:', error);
//         this.isLoading.set(false);
//         this.snackBar.open('Failed to load add-on details. Please try again.', 'Close', { duration: 5000 });
//         this.navigateBack();
//       }
//     });
//   }

//   patchAddonForm(addon: AddOn): void {
//     this.addonForm.patchValue({
//       name: addon.name,
//       price: addon.price,
//       description: addon.description || '',
//       isActive: addon.isActive
//     });
//   }

//   navigateBack(): void {
//     this.router.navigate(['/addons']);
//   }

//   onSubmit(): void {
//     if (this.addonForm.invalid || this.isSubmitting()) {
//       // Mark all fields as touched to show validation errors
//       Object.keys(this.addonForm.controls).forEach(key => {
//         this.addonForm.get(key)?.markAsTouched();
//       });
//       return;
//     }
    
//     this.isSubmitting.set(true);
    
//     // Get form value
//     const formValue = this.addonForm.value;
    
//     // Build the addon object
//     const addon: AddOnCreate | AddOnUpdate = {
//       name: formValue.name,
//       price: formValue.price,
//       description: formValue.description,
//       isActive: formValue.isActive
//     };
    
//     // Update or create the addon
//     if (this.isEditMode()) {
//       const addonId = this.route.snapshot.paramMap.get('id') as string;
//       this.addonService.updateAddon(addonId, addon as AddOnUpdate)
//         .subscribe({
//           next: () => {
//             this.snackBar.open('Add-on updated successfully', 'Close', { duration: 3000 });
//             this.isSubmitting.set(false);
//             this.navigateBack();
//           },
//           error: (error) => {
//             console.error('Error updating add-on:', error);
//             this.isSubmitting.set(false);
//             this.snackBar.open('Failed to update add-on. Please try again.', 'Close', { duration: 5000 });
//           }
//         });
//     } else {
//       this.addonService.createAddon(addon as AddOnCreate)
//         .subscribe({
//           next: () => {
//             this.snackBar.open('Add-on created successfully', 'Close', { duration: 3000 });
//             this.isSubmitting.set(false);
//             this.navigateBack();
//           },
//           error: (error) => {
//             console.error('Error creating add-on:', error);
//             this.isSubmitting.set(false);
//             this.snackBar.open('Failed to create add-on. Please try again.', 'Close', { duration: 5000 });
//           }
//         });
//     }
//   }
// }
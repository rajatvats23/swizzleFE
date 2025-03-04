import { CommonModule } from "@angular/common";
import { Component, inject, Inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { Category } from "../../../shared/interfaces/category.interface";
import { MatSnackBar } from "@angular/material/snack-bar";
import { finalize } from "rxjs";
import { ImageUploadService } from "../../../services/image-upload.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: "app-category-details",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: "category-details.component.html",
  styleUrls: ["category-details.component.scss"],
})
export class CategoryDetailsComponent implements OnInit {
  form: FormGroup;
  imagePreview = signal<string | null>(null);
  uploading = signal<boolean>(false);
  isEditMode: boolean = false;
  
  private imageUploadService = inject(ImageUploadService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  
  constructor(
    public dialogRef: MatDialogRef<CategoryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      imageUrl: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.imagePreview.set(this.data.imageUrl);
      this.form.patchValue({
        name: this.data.name,
        description: this.data.description,
        imageUrl: this.data.imageUrl
      });
      
      // In edit mode, make imageUrl not required if it already has a value
      if (this.data.imageUrl) {
        this.form.get('imageUrl')?.setValidators(null);
      }
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

    // Show temporary preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload the file
    this.uploading.set(true);
    this.imageUploadService.uploadImage(file)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: (response) => {
          // Update form with the image URL
          this.form.patchValue({ imageUrl: response.url });
          this.imagePreview.set(response.url);
          this.form.get('imageUrl')?.markAsTouched();
          this.snackBar.open('Image uploaded successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open(`Error uploading image: ${error.message}`, 'Close', { duration: 5000 });
          this.imagePreview.set(null);
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid || this.uploading()) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.form.value;
    this.dialogRef.close(formValue);
  }
}
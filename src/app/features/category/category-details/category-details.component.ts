import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { Category } from "../../../shared/interfaces/category.interface";

@Component({
  selector: "app-category-details",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: "category-details.component.html",
  styleUrls: ["category-details.component.scss"],
})
export class CategoryDetailsComponent implements OnInit {
  form: FormGroup;
  imagePreview: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.maxLength(500)]],
      image: [null, this.data ? [] : [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.imagePreview = this.data.imageUrl;
      this.form.patchValue({
        name: this.data.name,
        description: this.data.description
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.validateAndPreviewImage(file);
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
      this.validateAndPreviewImage(file);
    }
  }

  private validateAndPreviewImage(file: File): void {
    if (!file.type.startsWith("image/")) {
      this.form.get("image")?.setErrors({ invalidFileType: true });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.form.patchValue({ image: file });
      this.form.get("image")?.markAsTouched();
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    
    const imageFile = this.form.get('image')?.value;
    if (imageFile) {
      formData.append('image', imageFile);
    }

    this.dialogRef.close(formData);
  }
}
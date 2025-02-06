// dialog.component.ts
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-dialog",
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDetailsComponent>
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.maxLength(500)]],
      image: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {}

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

    this.dialogRef.close(this.form.value);
  }
}

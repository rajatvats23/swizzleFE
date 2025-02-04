import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { SharedModule } from "../../../shared/shared.module";
@Component({
    selector: 'app-category-details',
    imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, MatInputModule],
    templateUrl: './category-details.component.html',
    styleUrls: ['./category-details.component.scss'],
    standalone: true
})
export class CategoryDetailsComponent {}
import { NgModule } from "@angular/core";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from "@angular/material/tooltip";

const declarations = [
    MatCardModule,MatSidenavModule, MatListModule, 
        MatIconModule, 
        MatToolbarModule, 
        MatButtonModule,
        MatPaginatorModule,
        MatDialogModule,
        MatFormFieldModule,
        MatTooltipModule
]
@NgModule({
    imports: [...declarations],
    exports: [...declarations]
})
export class SharedModule{}
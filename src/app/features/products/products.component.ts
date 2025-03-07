import { Component } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: Date;
}

@Component({
  selector: 'app-products',
  template: `<div class="container">
  
  <!-- <app-generic-table 
    [data]="users" 
    [columns]="columns"
    [title]="'Products Listings'"
    [pageSize]="5">
  </app-generic-table> -->
</div>
`,
styles: [`
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  margin-bottom: 24px;
  color: #333;
}`]
})
export class ProductsComponent {

  users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: new Date('2023-11-15')
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'User',
      status: 'Active',
      lastActive: new Date('2023-11-14')
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Editor',
      status: 'Inactive',
      lastActive: new Date('2023-10-23')
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: 'User',
      status: 'Active',
      lastActive: new Date('2023-11-10')
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Viewer',
      status: 'Pending',
      lastActive: new Date('2023-11-01')
    },
    {
      id: 6,
      name: 'Diana Miller',
      email: 'diana.miller@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: new Date('2023-11-12')
    }
  ];

  columns:any[] = [
    {
      name: 'id',
      header: 'ID',
      cell: (element: User) => element.id.toString(),
      sortable: true
    },
    {
      name: 'name',
      header: 'Name',
      cell: (element: User) => element.name,
      sortable: true,
      filterable: true
    },
    {
      name: 'email',
      header: 'Email',
      cell: (element: User) => element.email,
      sortable: true,
      filterable: true
    },
    {
      name: 'role',
      header: 'Role',
      cell: (element: User) => element.role,
      sortable: true,
      filterable: true
    },
    {
      name: 'status',
      header: 'Status',
      cell: (element: User) => element.status,
      sortable: true
    },
    {
      name: 'lastActive',
      header: 'Last Active',
      cell: (element: User) => element.lastActive.toLocaleDateString(),
      sortable: true
    }
  ];
}
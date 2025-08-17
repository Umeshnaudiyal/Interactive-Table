import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTable, { Column } from './DataTable';

interface TestUser {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'inactive';
}

const mockUsers: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, status: 'active' },
];

const mockColumns: Column<TestUser>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
  { key: 'status', title: 'Status', dataIndex: 'status' },
];

describe('DataTable', () => {
  it('renders table with data', () => {
    render(<DataTable data={mockUsers} columns={mockColumns} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<DataTable data={mockUsers} columns={mockColumns} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={mockUsers} columns={mockColumns} loading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DataTable data={[]} columns={mockColumns} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns} 
        emptyMessage="No users found" 
      />
    );
    
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('handles column sorting', () => {
    render(<DataTable data={mockUsers} columns={mockColumns} />);
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    // Check if data is sorted (Bob, Jane, John alphabetically)
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Bob Johnson');
    expect(rows[2]).toHaveTextContent('Jane Smith');
    expect(rows[3]).toHaveTextContent('John Doe');
  });

  it('handles row selection', () => {
    const onRowSelect = vi.fn();
    render(
      <DataTable 
        data={mockUsers} 
        columns={mockColumns} 
        selectable={true}
        onRowSelect={onRowSelect}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Click first row checkbox
    
    expect(onRowSelect).toHaveBeenCalledWith([mockUsers[0]]);
  });

  it('handles select all', () => {
    const onRowSelect = vi.fn();
    render(
      <DataTable 
        data={mockUsers} 
        columns={mockColumns} 
        selectable={true}
        onRowSelect={onRowSelect}
      />
    );
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);
    
    expect(onRowSelect).toHaveBeenCalledWith(mockUsers);
  });

  it('renders custom cell content', () => {
    const columnsWithRender: Column<TestUser>[] = [
      ...mockColumns,
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'id',
        render: (value, record) => (
          <button>Edit {record.name}</button>
        ),
      },
    ];

    render(<DataTable data={mockUsers} columns={columnsWithRender} />);
    
    expect(screen.getByText('Edit John Doe')).toBeInTheDocument();
    expect(screen.getByText('Edit Jane Smith')).toBeInTheDocument();
  });

  it('applies correct ARIA attributes', () => {
    render(<DataTable data={mockUsers} columns={mockColumns} selectable={true} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5); // 4 columns + 1 select column
    expect(screen.getAllByRole('row')).toHaveLength(4); // 1 header + 3 data rows
  });

  it('handles sorting with different data types', () => {
    render(<DataTable data={mockUsers} columns={mockColumns} />);
    
    // Test number sorting
    const ageHeader = screen.getByText('Age');
    fireEvent.click(ageHeader);
    
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('25'); // Jane (youngest)
    expect(rows[2]).toHaveTextContent('30'); // John
    expect(rows[3]).toHaveTextContent('35'); // Bob (oldest)
  });
});
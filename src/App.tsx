import React, { useState } from 'react';
import DataTable, { Column } from './components/DataTable';
import { Users, Mail, Calendar, Activity, Plus, Download, Filter } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: Date;
  salary: number;
}

const generateMockUsers = (): User[] => [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    age: 32,
    department: 'Engineering',
    status: 'active',
    joinDate: new Date('2022-01-15'),
    salary: 85000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    age: 28,
    department: 'Design',
    status: 'active',
    joinDate: new Date('2022-03-20'),
    salary: 75000,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    age: 35,
    department: 'Marketing',
    status: 'inactive',
    joinDate: new Date('2021-11-10'),
    salary: 70000,
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    age: 29,
    department: 'Engineering',
    status: 'active',
    joinDate: new Date('2023-02-01'),
    salary: 90000,
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@company.com',
    age: 41,
    department: 'Sales',
    status: 'pending',
    joinDate: new Date('2023-06-15'),
    salary: 65000,
  },
  {
    id: 6,
    name: 'Diana Martinez',
    email: 'diana.martinez@company.com',
    age: 26,
    department: 'HR',
    status: 'active',
    joinDate: new Date('2023-01-10'),
    salary: 60000,
  },
];

function App() {
  const [users] = useState<User[]>(generateMockUsers());
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: User['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-red-100 text-red-800', label: 'Inactive' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {record.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{record.department}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'age',
      title: 'Age',
      dataIndex: 'age',
      sortable: true,
      width: '80px',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      dataIndex: 'joinDate',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(value)}</span>
        </div>
      ),
    },
    {
      key: 'salary',
      title: 'Salary',
      dataIndex: 'salary',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      ),
    },
  ];

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const handleRowSelect = (selectedRows: User[]) => {
    setSelectedUsers(selectedRows);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={simulateLoading}
                className="flex items-center space-x-2 sm:px-4 sm:py-4 px-2 py-1 sm:text-md text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Activity className="w-4 h-4" />
                <span>Simulate Loading</span>
              </button>
              <button
                onClick={() => setShowEmpty(!showEmpty)}
                className="flex items-center space-x-2 sm:px-4 sm:py-4 px-2 py-1 sm:text-md text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>{showEmpty ? 'Show Data' : 'Show Empty'}</span>
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            A comprehensive data table component with sorting, selection, and responsive design.
          </p>
        </div>

        {/* Stats */}
        {selectedUsers.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  {selectedUsers.length} employee{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={simulateLoading} className="flex items-center space-x-2 px-3 py-1.5 bg-white text-blue-600 border border-blue-300 text-sm rounded-md hover:bg-blue-50 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add to Group</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Data Table */}
        <div className="mb-12">
          <DataTable
            data={showEmpty ? [] : users}
            columns={columns}
            loading={isLoading}
            selectable={true}
            onRowSelect={handleRowSelect}
            emptyMessage="No employees found. Try adjusting your filters or add new employees."
          />
        </div>

        {/* Feature Showcase */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Features Demonstrated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Column Sorting</h3>
              <p className="text-gray-600 text-sm">Click on any column header to sort data in ascending/descending order.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Row Selection</h3>
              <p className="text-gray-600 text-sm">Select individual rows or use the header checkbox to select all rows.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Loading States</h3>
              <p className="text-gray-600 text-sm">Click "Simulate Loading" to see the loading overlay in action.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Empty State</h3>
              <p className="text-gray-600 text-sm">Toggle "Show Empty" to see how the table handles no data scenarios.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Custom Rendering</h3>
              <p className="text-gray-600 text-sm">Columns support custom render functions for complex data display.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600 text-sm">Full ARIA support with proper roles, labels, and keyboard navigation.</p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Technical Implementation</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Features Included</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ TypeScript with proper generic typing</li>
                  <li>✅ Column sorting (string, number, date)</li>
                  <li>✅ Single and multiple row selection</li>
                  <li>✅ Loading and empty states</li>
                  <li>✅ Custom cell rendering</li>
                  <li>✅ Responsive design</li>
                  <li>✅ Full accessibility (ARIA)</li>
                  <li>✅ Comprehensive test suite</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Props Interface</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <code className="text-xs text-gray-800">
                    {`interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (rows: T[]) => void;
  // ... and more
}`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
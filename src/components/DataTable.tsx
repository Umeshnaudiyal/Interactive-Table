import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Check, Minus, Loader2, Database } from 'lucide-react';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  emptyMessage?: string;
  rowKey?: keyof T | ((record: T) => string | number);
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: string | null;
  direction: SortDirection;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className = '',
  emptyMessage = 'No data available',
  rowKey = 'id'
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Get unique key for each row
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // Sort data based on current sort state
  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.direction) {
      return data;
    }

    const column = columns.find(col => col.key === sortState.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortState.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortState.direction === 'asc' ? 1 : -1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortState.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortState.direction === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Fallback to string comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      const comparison = aStr.localeCompare(bStr);
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState, columns]);

  // Handle column sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortState(prev => {
      if (prev.key === column.key) {
        // Cycle through: asc -> desc -> null
        const newDirection: SortDirection = 
          prev.direction === 'asc' ? 'desc' : 
          prev.direction === 'desc' ? null : 'asc';
        return { key: newDirection ? column.key : null, direction: newDirection };
      } else {
        return { key: column.key, direction: 'asc' };
      }
    });
  };

  // Handle row selection
  const handleRowSelect = (rowKey: string | number, record: T) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (newSelectedRows.has(rowKey)) {
      newSelectedRows.delete(rowKey);
    } else {
      newSelectedRows.add(rowKey);
    }
    
    setSelectedRows(newSelectedRows);
    
    if (onRowSelect) {
      const selectedRecords = data.filter((record, index) => 
        newSelectedRows.has(getRowKey(record, index))
      );
      onRowSelect(selectedRecords);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      // Deselect all
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      // Select all
      const allKeys = new Set(data.map((record, index) => getRowKey(record, index)));
      setSelectedRows(allKeys);
      onRowSelect?.(data);
    }
  };

  // Check if all rows are selected
  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;

  // Render sort icon
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortState.key === column.key;
    const direction = isActive ? sortState.direction : null;

    return (
      <span className="ml-2 inline-flex flex-col">
        <ChevronUp 
          className={`w-3 h-3 -mb-1 transition-colors ${
            isActive && direction === 'asc' 
              ? 'text-blue-600' 
              : 'text-gray-400 group-hover:text-gray-600'
          }`} 
        />
        <ChevronDown 
          className={`w-3 h-3 transition-colors ${
            isActive && direction === 'desc' 
              ? 'text-blue-600' 
              : 'text-gray-400 group-hover:text-gray-600'
          }`} 
        />
      </span>
    );
  };

  // Render checkbox
  const renderCheckbox = (checked: boolean, indeterminate: boolean = false, onChange?: () => void) => (
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        ref={(input) => {
          if (input) input.indeterminate = indeterminate;
        }}
      />
      <div
        onClick={onChange}
        className={`w-4 h-4 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center ${
          checked || indeterminate
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        {indeterminate ? (
          <Minus className="w-3 h-3" />
        ) : checked ? (
          <Check className="w-3 h-3" />
        ) : null}
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr role="row">
              {selectable && (
                <th className="w-12 px-4 py-3 text-left" role="columnheader">
                  {renderCheckbox(isAllSelected, isIndeterminate, handleSelectAll)}
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-900 ${
                    column.sortable ? 'cursor-pointer select-none group hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                  role="columnheader"
                  aria-sort={
                    sortState.key === column.key
                      ? sortState.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : column.sortable
                      ? 'none'
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    {column.title}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200" role="rowgroup">
            {sortedData.length === 0 ? (
              <tr role="row">
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-500"
                  role="cell"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Database className="w-8 h-8 text-gray-400" />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRows.has(key);
                
                return (
                  <tr
                    key={key}
                    className={`hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                    role="row"
                    aria-selected={selectable ? isSelected : undefined}
                  >
                    {selectable && (
                      <td className="px-4 py-3" role="cell">
                        {renderCheckbox(
                          isSelected,
                          false,
                          () => handleRowSelect(key, record)
                        )}
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-3 text-sm text-gray-900"
                        role="cell"
                      >
                        {column.render
                          ? column.render(record[column.dataIndex], record, index)
                          : String(record[column.dataIndex] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
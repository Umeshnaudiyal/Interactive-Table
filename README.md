
# Data Table Component
A simple and flexible data table component with built-in sorting, row selection, and state handling.

## Features

- 📊 Display tabular data with customizable columns

- ↕️ Column sorting (ascending/descending)

- ✅ Row selection (single & multiple)

- ⏳ Loading state while fetching data

- 🚫 Empty state when no data is available

## Installation

Install my-project with npm

```bash
 npm install @your-org/data-table
 or
 yarn add @your-org/data-table
  
```
    
## Usage/Examples

import { DataTable } from "@your-org/data-table";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
];

const data = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

export default function App() {
  return <DataTable columns={columns} data={data} />;
}


##  Props


| Prop           | Type                                                    | Default     | Description                        |
| -------------- | ------------------------------------------------------- | ----------- | ---------------------------------- |
| `columns`      | `{ key: string; label: string; sortable?: boolean; }[]` | —           | Defines table columns              |
| `data`         | `object[]`                                              | `[]`        | Array of row data                  |
| `loading`      | `boolean`                                               | `false`     | Shows loading state                |
| `emptyMessage` | `string`                                                | `"No data"` | Message when no rows are available |
| `rowSelection` | `"single" \| "multiple" \| null`                        | `null`      | Enables row selection mode         |
| `onRowSelect`  | `(row: object \| object[]) => void`                     | —           | Callback when rows are selected    |

## Setup Instructions

To deploy this project run

```bash
# Install dependencies
    npm install

# Run application
    npm run dev

# Run tests
    npm test

```


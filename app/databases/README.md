# Database Selection Feature

## Overview

This feature allows users to select a database after logging in. The selected database is stored in Redux and localStorage for persistence.

## File Structure

```
app/
├── databases/
│   ├── page.tsx                      # Main database selection page with card UI
│   ├── _hooks/
│   │   └── useDatabases.ts           # Custom hooks for database operations
│   └── _components/
│       └── CreateDatabaseModal.tsx   # Modal for creating new databases
│
├── login/
│   └── _hooks/
│       └── useLogin.ts               # Updated to redirect to /databases after login
│
redux/
├── store/
│   └── slices/
│       └── databaseSlice.ts          # Redux slice for database state management
└── RootReducer.ts                    # Updated to include database reducer

services/
└── databases/
    └── databases.service.ts          # API service with 6 endpoints
```

## Components

### 1. Database Selection Page (`app/databases/page.tsx`)

- Displays all available databases as cards
- Shows database details: icon, name, description, tags, collections count, data count
- Allows users to select a database (redirects to `/admin`)
- "Create New Database" button opens modal
- Loading state with skeletons

### 2. Create Database Modal (`app/databases/_components/CreateDatabaseModal.tsx`)

- Form with validation using @tanstack/react-form
- Fields:
  - Icon selection (8 common icons)
  - Name (required, slug format)
  - Display Name
  - Description
  - Tags (add/remove dynamically)
  - Settings (language, timezone, date format)
- Submit creates database and closes modal

### 3. Custom Hooks (`app/databases/_hooks/useDatabases.ts`)

#### `useDatabases()`

- Fetches all databases using React Query
- Updates Redux store with fetched data
- Returns query state (data, isLoading, error)

#### `useCreateDatabase()`

- Mutation hook for creating new database
- Validates form data with Zod schema
- Shows success/error toasts
- Invalidates databases query to refetch list
- Updates Redux store

#### `useSelectDatabase()`

- Selects a database and saves to Redux + localStorage
- Shows success toast with database name

## Redux State

### Database Slice (`redux/store/slices/databaseSlice.ts`)

```typescript
interface DatabaseState {
  selectedDatabase: DatabaseSchema | null;
  databases: DatabaseSchema[];
}
```

**Actions:**

- `setSelectedDatabase(database)` - Set currently selected database
- `clearSelectedDatabase()` - Clear selection
- `setDatabases(databases[])` - Set full list of databases
- `addDatabase(database)` - Add new database to list
- `updateDatabase(database)` - Update existing database
- `removeDatabase(id)` - Remove database from list

**Selectors:**

- `selectDatabase(state)` - Get entire database state
- `selectSelectedDatabase(state)` - Get selected database
- `selectDatabases(state)` - Get databases list

## API Service

### Database Service (`services/databases/databases.service.ts`)

**Endpoints:**

1. `createDatabase(formData)` - POST `/databases`
2. `getDatabases(params?)` - GET `/databases` (with optional pagination)
3. `getDatabaseById(id)` - GET `/databases/:id`
4. `updateDatabase(id, formData)` - PUT `/databases/:id`
5. `deactivateDatabase(id)` - DELETE `/databases/:id` (soft delete)
6. `permanentDeleteDatabase(id)` - DELETE `/databases/:id/permanent`

All requests validate input using Zod schemas before sending.

## Flow

1. **Login** → Redirect to `/databases`
2. **Database Selection Page** → Shows all databases as cards
3. **User Actions:**
   - Click database card → Select & redirect to `/admin`
   - Click "Create New Database" → Open modal
   - Fill form & submit → Create database → Update list
4. **Selected Database** → Stored in Redux + localStorage

## Usage Examples

### Accessing Selected Database

```typescript
import { useSelector } from "react-redux";
import { selectSelectedDatabase } from "@/redux/store/slices/databaseSlice";

function MyComponent() {
  const selectedDb = useSelector(selectSelectedDatabase);

  return <div>{selectedDb?.displayName}</div>;
}
```

### Creating a Database Programmatically

```typescript
import { useCreateDatabase } from "@/app/databases/_hooks/useDatabases";

function MyComponent() {
  const createMutation = useCreateDatabase();

  const handleCreate = () => {
    createMutation.mutate({
      name: "my-db",
      displayName: "My Database",
      icon: "💾",
      tags: ["production"],
      settings: {
        defaultLanguage: "en",
        timezone: "Asia/Ho_Chi_Minh",
      },
    });
  };
}
```

## Dependencies

- `@tanstack/react-form` - Form state management
- `@tanstack/react-query` - Server state management
- `@reduxjs/toolkit` - Redux state management
- `zod` - Schema validation
- `sonner` - Toast notifications
- Shadcn UI components: Dialog, Card, Button, Input, etc.

## Notes

- Database selection persists across page refreshes (localStorage)
- All API calls are type-safe with Zod validation
- Loading states handled with Skeleton components
- Error handling with toast notifications

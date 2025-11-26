import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { DatabaseSchema } from "@/lib/schemas/databases/databases.schema";

interface DatabaseState {
  selectedDatabase: DatabaseSchema | null;
  databases: DatabaseSchema[];
}

const initialState: DatabaseState = {
  selectedDatabase: null,
  databases: [],
};

const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    setSelectedDatabase: (state, action: PayloadAction<DatabaseSchema>) => {
      state.selectedDatabase = action.payload;
    },
    clearSelectedDatabase: (state) => {
      state.selectedDatabase = null;
    },
    setDatabases: (state, action: PayloadAction<DatabaseSchema[]>) => {
      state.databases = action.payload;
    },
    addDatabase: (state, action: PayloadAction<DatabaseSchema>) => {
      state.databases.push(action.payload);
    },
    updateDatabase: (state, action: PayloadAction<DatabaseSchema>) => {
      const index = state.databases.findIndex(
        (db) => db.id === action.payload.id
      );
      if (index !== -1) {
        state.databases[index] = action.payload;
      }
    },
    removeDatabase: (state, action: PayloadAction<string>) => {
      state.databases = state.databases.filter(
        (db) => db.id !== action.payload
      );
    },
  },
});

export const {
  setSelectedDatabase,
  clearSelectedDatabase,
  setDatabases,
  addDatabase,
  updateDatabase,
  removeDatabase,
} = databaseSlice.actions;

export const selectDatabase = (state: RootState) => state.database;
export const selectSelectedDatabase = (state: RootState) =>
  state.database.selectedDatabase;
export const selectDatabases = (state: RootState) => state.database.databases;

export default databaseSlice.reducer;

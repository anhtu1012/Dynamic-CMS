import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./store/slices/loginSlice";
import permissionsReducer from "./store/slices/permissions";
import databaseReducer from "./store/slices/databaseSlice";
// import darkModeReducer from "./store/slices/darkModeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  permissions: permissionsReducer,
  database: databaseReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

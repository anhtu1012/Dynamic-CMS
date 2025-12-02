import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./store/slices/loginSlice";
import databaseReducer from "./store/slices/databaseSlice";
// import darkModeReducer from "./store/slices/darkModeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  database: databaseReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

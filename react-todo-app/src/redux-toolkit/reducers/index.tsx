import { combineReducers } from "@reduxjs/toolkit";
// styles components
import popupSlice from "./popupSlice";
import todosSlice from "./todosSlice";

export const rootReducers = combineReducers({
  popupSlice,
  todosSlice,
});

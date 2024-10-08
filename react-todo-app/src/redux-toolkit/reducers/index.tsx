import { combineReducers } from "@reduxjs/toolkit";
// styles components
import popupSlice from "./popupSlice";

export const rootReducers = combineReducers({
  popupSlice,
});

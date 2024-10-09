import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import {
  DefaultPopupMessage,
  type PopupMessageInterface,
} from "../../components/globalTypes/GlobalTypes";

export interface ActionsState {
  successPopup: PopupMessageInterface;
  errorPopup: PopupMessageInterface;
  isLoading: boolean;
  deleteTodoPopup: boolean;
  deleteTodosPopup: boolean;
  editTodoPopup: boolean;
  addTodosPopup: boolean;
  deleteSelectedTodosPopup: boolean;
}

const initialState: ActionsState = {
  successPopup: DefaultPopupMessage,
  errorPopup: DefaultPopupMessage,
  isLoading: false,
  deleteTodoPopup: false,
  deleteTodosPopup: false,
  editTodoPopup: false,
  addTodosPopup: false,
  deleteSelectedTodosPopup: false,
};

export const popupSlice: Slice<ActionsState> = createSlice({
  name: "popup",
  initialState,
  reducers: {
    showIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showSucessPopup: (state, action: PayloadAction<PopupMessageInterface>) => {
      state.successPopup = action.payload;
    },
    showErrorPopup: (state, action: PayloadAction<PopupMessageInterface>) => {
      state.errorPopup = action.payload;
    },
    showDeleteTodoPopup: (state, action: PayloadAction<boolean>) => {
      state.deleteTodoPopup = action.payload;
    },
    showDeleteTodosPopup: (state, action: PayloadAction<boolean>) => {
      state.deleteTodosPopup = action.payload;
    },
    showEditTodosPopup: (state, action: PayloadAction<boolean>) => {
      state.editTodoPopup = action.payload;
    },
    showAddTodosPopup: (state, action: PayloadAction<boolean>) => {
      state.addTodosPopup = action.payload;
    },
    showDeleteSelectedTodosPopup: (state, action: PayloadAction<boolean>) => {
      state.deleteSelectedTodosPopup = action.payload;
    },

    hidePopup: (state) => {
      state.isLoading = false;
      state.deleteTodoPopup = false;
      state.deleteTodosPopup = false;
      state.editTodoPopup = false;
      state.addTodosPopup = false;
      state.deleteSelectedTodosPopup = false;
    },
  },
});

export const {
  hidePopup,
  showSucessPopup,
  showErrorPopup,
  showIsLoading,
  showDeleteTodoPopup,
  showDeleteTodosPopup,
  showEditTodosPopup,
  showAddTodosPopup,
  showDeleteSelectedTodosPopup,
} = popupSlice.actions;

export default popupSlice.reducer;

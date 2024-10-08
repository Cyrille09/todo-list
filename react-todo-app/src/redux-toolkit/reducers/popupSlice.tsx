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
}

const initialState: ActionsState = {
  successPopup: DefaultPopupMessage,
  errorPopup: DefaultPopupMessage,
  isLoading: false,
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

    hidePopup: (state) => {
      state.successPopup = DefaultPopupMessage;
      state.errorPopup = DefaultPopupMessage;
      state.isLoading = false;
    },
  },
});

export const { hidePopup, showSucessPopup, showErrorPopup, showIsLoading } =
  popupSlice.actions;

export default popupSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import {
  DefaultTodos,
  TodosInterface,
} from "../../components/globalTypes/GlobalTypes";

export interface ActionsState {
  todos: TodosInterface;
}

const initialState: ActionsState = {
  todos: DefaultTodos,
};

export const todosSlice: Slice<ActionsState> = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodosRecord: (state, action: PayloadAction<TodosInterface>) => {
      state.todos = action.payload;
    },
  },
});

export const { setTodosRecord } = todosSlice.actions;

export default todosSlice.reducer;

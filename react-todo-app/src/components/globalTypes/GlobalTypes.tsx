export interface PopupMessageInterface {
  status: boolean;
  message: string;
}

export const DefaultPopupMessage = {
  status: false,
  message: "",
};

export interface TodosInterface {
  page: any;
  perPage: number;
  total: number;
  todos: {
    date: string;
    id: number;
    status: string;
    task: string;
  }[];
}

export const DefaultTodos = {
  page: "1",
  perPage: 10,
  total: 0,
  todos: [],
};

export interface TodoInterface {
  id: number;
  status: string;
  task: string;
}

export const DefaultTodo = {
  id: 0,
  status: "active",
  task: "",
};

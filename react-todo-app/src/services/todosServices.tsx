import axiosInterceptors from "../lib/axiosInterceptors";

export const getTodos = async (query: {
  filter: string;
  status: string;
  page: number;
  itemsPerPage?: number;
}) => {
  return await axiosInterceptors.get("todos", { ...query, itemsPerPage: 10 });
};

export const getTodo = async (id: number) => {
  return await axiosInterceptors.get(`todos/${id}`, {});
};

export async function addTodo(data: { task: string }) {
  return await axiosInterceptors.post(`todos`, data);
}

export async function addTodos(tasks: string[]) {
  return await axiosInterceptors.post(`todos/multiple`, { tasks });
}

export async function updateTodo(
  id: number,
  data: { task: string; status: string }
) {
  return await axiosInterceptors.patch(`todos/${id}`, data);
}

export async function deleteTodo(id: number) {
  await axiosInterceptors.remove(`todos/${id}`, {});
}

export async function deleteTodos() {
  await axiosInterceptors.remove(`todos/all`, {});
}

export async function deleteSelectedTodos(todos: []) {
  await axiosInterceptors.post(`todos/selected`, todos);
}

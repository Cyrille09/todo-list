import * as yup from "yup";

export const todoStatusForm = yup.object().shape({
  status: yup.number().required("Area of law is required"),
});

export const todoForm = yup.object().shape({
  task: yup.string().required(""),
});

export const editTodoForm = yup.object().shape({
  task: yup.string().required("Task is required"),
});

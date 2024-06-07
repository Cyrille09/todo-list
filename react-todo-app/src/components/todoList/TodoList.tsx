import React, { useEffect, useState } from "react";
import {
  addTodo,
  deleteTodo,
  deleteTodos,
  getTodos,
  updateTodo,
} from "../../services/todosServices";
import "./todoList.scss";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { InputField } from "../fieds/inputField";
import { GlobalButton } from "../button/GlobalButton";
import { editTodoForm, todoForm } from "../formValidation/formValidation";
import { Table } from "react-bootstrap";
import { KeyValueCard } from "../cards";
import { ReactSelect } from "../fieds/GlobalSelect";
import { SearchField } from "../fieds/SearchField";
import { Pagination } from "../pagination/pagination";
import {
  DeleteAllTodosModal,
  DeleteTodoModal,
  EditTodoModal,
} from "./todoModal";
import { ACTIONS_ERROR_MESSAGE } from "../../constants/globalText";
import { format } from "date-fns";
import { GlobalErrorMessage } from "../errorAndSuccessMessage";
import { LoadingData } from "../loading";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<any>({});
  const [todo, setTodo] = useState<{
    id: number;
    task: string;
    status: string;
  }>({
    id: 0,
    task: "",
    status: "",
  });
  const [deleteTodoModal, setDeleteTodoModal] = useState(false);
  const [deleteAllTodosModal, setDeleteAllTodosModal] = useState(false);
  const [editTodoModal, setEditTodoModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [task, setTask] = useState<string>("");
  const [errorMessagePopup, setErrorMessagePopup] = useState<{
    status: boolean;
    message: string;
  }>({ status: false, message: "" });
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const filterParam = searchParams.get("filter");
  const statusParam = searchParams.get("status");
  const pageParam = searchParams.get("page");

  const pageCount = Math.ceil(todos.total / todos.perPage);

  const changePage = async ({ selected }: any) => {
    navigate(
      `/?filter=${filterParam || ""}&status=${statusParam || ""}&page=${
        selected + 1
      }`
    );
  };

  useEffect(() => {
    let isSubscribed = true;
    const getTodosList = () => {
      getTodos({
        filter: filterParam || "",
        status: statusParam || "",
        page: (pageParam && parseInt(pageParam)) || 1,
      })
        .then((response) => {
          if (isSubscribed) {
            setTodos(response.data);
          }
        })
        .catch((error) => {});
    };
    getTodosList();
    return () => {
      isSubscribed = false;
    };
  }, [filterParam, pageParam, statusParam]);

  const getTodosData = () => {
    getTodos({
      filter: filterParam || "",
      status: statusParam || "",
      page: (pageParam && parseInt(pageParam)) || 1,
    })
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {});
  };

  const addTodoData = async (values: { task: string }) => {
    await addTodo(values)
      .then((response) => {
        setTask("");
        getTodosData();
      })
      .catch((error) => {
        setErrorMessagePopup({ status: true, message: ACTIONS_ERROR_MESSAGE });
      });
  };

  const editTodoData = async (todo: {
    id: number;
    task: string;
    status: string;
  }) => {
    setisLoading(true);
    await updateTodo(todo.id, todo)
      .then((response) => {
        getTodosData();
        closeModal();
      })
      .catch((error) => {
        setErrorMessagePopup({ status: true, message: ACTIONS_ERROR_MESSAGE });
        setisLoading(false);
      });
  };

  const deleteTodoData = async (id: number) => {
    setisLoading(true);
    await deleteTodo(id)
      .then((response) => {
        getTodosData();
        closeModal();
      })
      .catch((error) => {
        setErrorMessagePopup({ status: true, message: ACTIONS_ERROR_MESSAGE });
        setisLoading(false);
      });
  };

  const deleteAllTodosData = async () => {
    setisLoading(true);
    await deleteTodos()
      .then((response) => {
        getTodosData();
        closeModal();
      })
      .catch((error) => {
        setErrorMessagePopup({ status: true, message: ACTIONS_ERROR_MESSAGE });
        setisLoading(false);
      });
  };

  const statuses = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  const statusesForUpdate = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  const closeModal = () => {
    setDeleteTodoModal(false);
    setDeleteAllTodosModal(false);
    setisLoading(false);
    setTodo({
      id: 0,
      task: "",
      status: "",
    });
    setErrorMessagePopup({ status: false, message: "" });

    setEditTodoModal(false);
  };

  return (
    <>
      <div>
        {deleteTodoModal && (
          <DeleteTodoModal
            show={deleteTodoModal}
            handleClose={closeModal}
            todo={todo}
            isLoading={isLoading}
            errorMessagePopup={errorMessagePopup}
            footer={
              <>
                <div className="global-modal-flex-row-wrap">
                  <div className="global-modal-left">
                    <GlobalButton format="white" size="sm" onClick={closeModal}>
                      No
                    </GlobalButton>
                  </div>
                  <div>
                    <GlobalButton
                      format="success"
                      onClick={() => deleteTodoData(todo.id)}
                      size="sm"
                    >
                      Yes
                    </GlobalButton>
                  </div>
                </div>
              </>
            }
          />
        )}

        {deleteAllTodosModal && (
          <DeleteAllTodosModal
            show={deleteAllTodosModal}
            handleClose={closeModal}
            isLoading={isLoading}
            errorMessagePopup={errorMessagePopup}
            footer={
              <>
                <div className="global-modal-flex-row-wrap">
                  <div className="global-modal-left">
                    <GlobalButton format="white" size="sm" onClick={closeModal}>
                      No
                    </GlobalButton>
                  </div>
                  <div>
                    <GlobalButton
                      format="success"
                      onClick={() => deleteAllTodosData()}
                      size="sm"
                    >
                      Yes
                    </GlobalButton>
                  </div>
                </div>
              </>
            }
          />
        )}

        {editTodoModal && (
          <EditTodoModal
            show={editTodoModal}
            handleClose={closeModal}
            formikData={
              <Formik
                form
                initialValues={{ ...todo }}
                validationSchema={editTodoForm}
                onSubmit={editTodoData}
                enableReinitialize
              >
                {({
                  handleChange,
                  handleBlur,
                  setFieldValue,
                  values,
                  errors,
                }) => (
                  <Form>
                    <div>
                      {errorMessagePopup.status && (
                        <>
                          <GlobalErrorMessage
                            message={errorMessagePopup.message}
                            status={errorMessagePopup.status}
                          />
                        </>
                      )}
                      {isLoading && <LoadingData />}

                      <div style={{ marginBottom: 20 }}>
                        <InputField
                          style={{ borderRadius: 0 }}
                          placeholder="Task"
                          name="task"
                          type="text"
                          id="task"
                          required
                          label="Task"
                          onBlur={handleBlur("task")}
                          autoCapitalize="none"
                          onChange={handleChange("task")}
                          error={errors.task}
                        />
                      </div>
                      <div>
                        <ReactSelect
                          id="status"
                          name="status"
                          required
                          options={statusesForUpdate}
                          label="Status"
                          value={statusesForUpdate.find(
                            (c: any) => c.value === values.status
                          )}
                          onChange={(selected: any) => {
                            if (selected.value) {
                              setFieldValue(`status`, selected.value);
                            }
                          }}
                        />
                      </div>

                      <div
                        className="global-modal-flex-row-wrap"
                        style={{ marginTop: 30 }}
                      >
                        <div className="global-modal-left">
                          <GlobalButton
                            format="white"
                            size="sm"
                            onClick={closeModal}
                          >
                            Cancel
                          </GlobalButton>
                        </div>
                        <div>
                          <GlobalButton
                            format="success"
                            type="submit"
                            size="sm"
                          >
                            Submit
                          </GlobalButton>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            }
          />
        )}
      </div>
      <div className="top-level">
        <div className="container">
          <div className="row">
            <div>
              <Formik
                onSubmit={addTodoData}
                initialValues={{ task }}
                validationSchema={todoForm}
                enableReinitialize
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                }) => {
                  return (
                    <div className="row">
                      <div className="col-sm-8">
                        <div className="d-flex add-task">
                          <InputField
                            style={{ borderRadius: 0 }}
                            placeholder="Task"
                            name="task"
                            id="task"
                            onBlur={handleBlur("task")}
                            autoCapitalize="none"
                            onChange={handleChange("task")}
                            error={errors.task}
                          />
                          <GlobalButton
                            onClick={() => {
                              handleSubmit();
                              setTask(values.task);
                            }}
                          >
                            Add
                          </GlobalButton>
                        </div>
                      </div>
                      <div className="col-sm-4" style={{ textAlign: "right" }}>
                        <GlobalButton
                          size="sm"
                          format="danger"
                          onClick={() => {
                            setDeleteAllTodosModal(true);
                            navigate("/");
                          }}
                        >
                          Delete All
                        </GlobalButton>
                      </div>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <div className="second-level">
        <div className="container">
          <div className="">
            <div className="row">
              <div className="">
                <Formik
                  initialValues={{ status: "all", todos: "" }}
                  onSubmit={() => {}}
                >
                  {({ values, setFieldValue, handleChange, handleBlur }) => {
                    return (
                      <KeyValueCard
                        headerStyle={{ background: "black", color: "white" }}
                        title="Todo Lists"
                        filter={
                          <div className="d-flex">
                            <div style={{ marginRight: "20px", width: 300 }}>
                              <SearchField
                                placeholder="Search..."
                                name="todos"
                                id="todos"
                                onBlur={handleBlur("todos")}
                                autoCapitalize="none"
                                onChange={handleChange("todos")}
                                onClick={() => {
                                  navigate(
                                    `/?filter=${values.todos || ""}&status=${
                                      statusParam || ""
                                    }&page=${1}`
                                  );
                                }}
                              />
                            </div>
                            <div
                              style={{
                                marginRight: "15px",
                                width: 120,
                                color: "black",
                              }}
                            >
                              <ReactSelect
                                id="status"
                                name="status"
                                required
                                options={statuses}
                                value={statuses.find(
                                  (c: any) => c.value === values.status
                                )}
                                onChange={(selected: any) => {
                                  if (selected.value) {
                                    const status =
                                      selected.value === "all"
                                        ? ""
                                        : selected.value;
                                    navigate(
                                      `/?filter=${
                                        filterParam || ""
                                      }&status=${status}&page=${1}`
                                    );
                                    setFieldValue(`status`, selected.value);
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <GlobalButton
                                size="sm"
                                format="secondary"
                                onClick={() => {
                                  setFieldValue("todos", "");
                                  setFieldValue(`status`, "all");
                                  navigate("/");
                                }}
                              >
                                Clear Filter
                              </GlobalButton>
                            </div>
                          </div>
                        }
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Task</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th colSpan={2} className="table-col-span">
                                Options
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {todos?.todos?.map(
                              (todo: {
                                task: string;
                                id: number;
                                status: string;
                                date: any;
                              }) => (
                                <tr key={todo.id} className="todo-list">
                                  <td>{todo.id}</td>
                                  <td>{todo.task}</td>
                                  <td>
                                    {todo.status === "active"
                                      ? "Active"
                                      : "Inactive"}
                                  </td>
                                  <td>
                                    {format(
                                      new Date(todo.date),
                                      "dd-MM-yyyy hh:mm"
                                    )}
                                  </td>
                                  <td className="table-col-span">
                                    <GlobalButton
                                      format="secondary"
                                      size="sm"
                                      onClick={() => {
                                        setEditTodoModal(true);
                                        setTodo({
                                          id: todo.id,
                                          task: todo.task,
                                          status: todo.status,
                                        });
                                      }}
                                    >
                                      Edit
                                    </GlobalButton>
                                  </td>
                                  <td className="table-col-span">
                                    <GlobalButton
                                      size="sm"
                                      format="danger"
                                      onClick={() => {
                                        setDeleteTodoModal(true);
                                        setTodo({
                                          id: todo.id,
                                          task: todo.task,
                                          status: todo.status,
                                        });
                                      }}
                                    >
                                      Delete
                                    </GlobalButton>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>

                        <div>
                          <Pagination
                            pageCount={pageCount}
                            perPage={todos.perPage}
                            forcePage={Number(pageParam || 1)}
                            handlePageClick={changePage}
                            total={todos.total}
                          />
                        </div>
                      </KeyValueCard>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoList;

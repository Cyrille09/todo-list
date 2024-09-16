import React, { useEffect, useState } from "react";
import {
  addTodo,
  deleteSelectedTodos,
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
  DeleteSelectedTodosModal,
  DeleteTodoModal,
  EditTodoModal,
} from "./todoModal";
import { ACTIONS_ERROR_MESSAGE } from "../../constants/globalText";
import { format } from "date-fns";
import { GlobalErrorMessage } from "../errorAndSuccessMessage";
import { LoadingData } from "../loading";
import { Checkbox } from "../fieds/checkbox";

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
  const [isLoading, setIsLoading] = useState(false);
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

  const changePage = async ({ selected }: { selected: number }) => {
    navigate(
      `/?filter=${filterParam || ""}&status=${statusParam || ""}&page=${
        selected + 1
      }`
    );
  };

  useEffect(() => {
    let isSubscribed = true;
    const getTodosList = () => {
      setIsLoading(true);
      resetErrorMessagePopup();
      getTodos({
        filter: filterParam || "",
        status: statusParam || "",
        page: (pageParam && parseInt(pageParam)) || 1,
      })
        .then((response) => {
          if (isSubscribed) {
            setTodos(response.data);
            closeModal();
          }
        })
        .catch((error) => {
          setErrorMessagePopup({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
          });
          setIsLoading(false);
        });
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

  const editTodoData = async (todo: {
    id: number;
    task: string;
    status: string;
  }) => {
    resetErrorMessagePopup();
    await updateTodo(todo.id, todo)
      .then((response) => {
        getTodosData();
        closeModal();
      })
      .catch((error) => {
        setErrorMessagePopup({ status: true, message: ACTIONS_ERROR_MESSAGE });
        setIsLoading(false);
      });
  };

  const deleteAllTodosData = async () => {
    resetErrorMessagePopup();
    setIsLoading(true);
    await deleteTodos()
      .then((response) => {
        getTodosData();
        closeModal();
      })
      .catch((error) => {
        setErrorMessagePopup({ status: true, message: ACTIONS_ERROR_MESSAGE });
        setIsLoading(false);
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
    setIsLoading(false);
    setTodo({
      id: 0,
      task: "",
      status: "",
    });
    setErrorMessagePopup({ status: false, message: "" });

    setEditTodoModal(false);
  };

  const resetErrorMessagePopup = () => {
    setErrorMessagePopup({ status: false, message: "" });
  };

  return (
    <>
      <>
        <Formik
          initialValues={{
            status: "all",
            todos: "",
            task: "",
            selectedTaskIds: [] as any,
            deleteSelectedTodosModal: false,
          }}
          onSubmit={() => {}}
          validationSchema={todoForm}
          enableReinitialize={true}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
          }) => {
            const deleteTodoData = async (id: number) => {
              setIsLoading(true);
              await deleteTodo(id)
                .then((response) => {
                  const findTodo = values.selectedTaskIds.find(
                    (selctedTodoId: number) => selctedTodoId === id
                  );

                  if (findTodo) {
                    const todoIds = values.selectedTaskIds.filter(
                      (findTodoId: number) => id !== findTodoId
                    );
                    values.selectedTaskIds = todoIds;
                    setFieldValue("selectedTaskIds", todoIds);
                  }

                  getTodosData();
                  closeModal();
                })
                .catch((error) => {
                  setErrorMessagePopup({
                    status: true,
                    message: ACTIONS_ERROR_MESSAGE,
                  });
                  setIsLoading(false);
                });
            };

            const deleteSelectedTodosData = async (values: []) => {
              setIsLoading(true);
              await deleteSelectedTodos(values)
                .then((response) => {
                  getTodosData();
                  setIsLoading(false);
                  setFieldValue("deleteSelectedTodosModal", false);
                  setFieldValue("selectedTaskIds", []);
                })
                .catch((error) => {
                  setErrorMessagePopup({
                    status: true,
                    message: ACTIONS_ERROR_MESSAGE,
                  });
                  setIsLoading(false);
                });
            };

            const addTodoData = async () => {
              resetErrorMessagePopup();
              await addTodo(values)
                .then((response) => {
                  setFieldValue("task", "");
                  getTodosData();
                })
                .catch((error) => {
                  setErrorMessagePopup({
                    status: true,
                    message: ACTIONS_ERROR_MESSAGE,
                  });
                });
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
                              <GlobalButton
                                format="white"
                                size="sm"
                                onClick={closeModal}
                              >
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
                              <GlobalButton
                                format="white"
                                size="sm"
                                onClick={closeModal}
                              >
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
                                    <p>{errorMessagePopup.message}</p>
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
                                      (c: { value: string }) =>
                                        c.value === values.status
                                    )}
                                    onChange={(selected: { value: string }) => {
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
                  {values.deleteSelectedTodosModal && (
                    <DeleteSelectedTodosModal
                      show={values.deleteSelectedTodosModal}
                      handleClose={() => {
                        closeModal();
                        setFieldValue("deleteSelectedTodosModal", false);
                      }}
                      isLoading={isLoading}
                      errorMessagePopup={errorMessagePopup}
                      footer={
                        <>
                          <div className="global-modal-flex-row-wrap">
                            <div className="global-modal-left">
                              <GlobalButton
                                format="white"
                                size="sm"
                                onClick={() => {
                                  closeModal();
                                  setFieldValue(
                                    "deleteSelectedTodosModal",
                                    false
                                  );
                                }}
                              >
                                No
                              </GlobalButton>
                            </div>
                            <div>
                              <GlobalButton
                                format="success"
                                onClick={() =>
                                  deleteSelectedTodosData(
                                    values.selectedTaskIds
                                  )
                                }
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
                </div>

                <div className="top-level">
                  <div className="container">
                    <div className="row">
                      <div>
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
                                  addTodoData();
                                }}
                              >
                                Add
                              </GlobalButton>
                            </div>
                          </div>
                          {(todos.total && !values.selectedTaskIds.length && (
                            <div
                              className="col-sm-4"
                              style={{ textAlign: "right" }}
                            >
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
                          )) ||
                            null}

                          {(todos.total && values.selectedTaskIds.length && (
                            <div
                              className="col-sm-4"
                              style={{ textAlign: "right" }}
                            >
                              <GlobalButton
                                size="sm"
                                format="danger"
                                onClick={() => {
                                  setFieldValue(
                                    "deleteSelectedTodosModal",
                                    true
                                  );
                                  navigate("/");
                                }}
                              >
                                {`Delete ${values.selectedTaskIds.length} selected`}
                              </GlobalButton>
                            </div>
                          )) ||
                            null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="second-level">
                  <div className="container">
                    <div className="error-message">
                      {errorMessagePopup.status && (
                        <>
                          <GlobalErrorMessage
                            message={errorMessagePopup.message}
                            status={errorMessagePopup.status}
                          />
                        </>
                      )}
                    </div>
                    <div className="">
                      <div className="row">
                        <div className="">
                          <KeyValueCard
                            headerStyle={{
                              background: "black",
                              color: "white",
                            }}
                            title="Todo Lists"
                            filter={
                              <div className="d-flex">
                                <div
                                  style={{
                                    marginRight: "20px",
                                    width: 300,
                                  }}
                                >
                                  <SearchField
                                    placeholder="Search..."
                                    name="todos"
                                    id="todos"
                                    onBlur={handleBlur("todos")}
                                    autoCapitalize="none"
                                    onChange={handleChange("todos")}
                                    onClick={() => {
                                      navigate(
                                        `/?filter=${
                                          values.todos || ""
                                        }&status=${statusParam || ""}&page=${1}`
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
                                      (c: { value: string }) =>
                                        c.value === values.status
                                    )}
                                    onChange={(selected: { value: string }) => {
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
                                    date: number | string;
                                  }) => (
                                    <tr key={todo.id} className="todo-list">
                                      <td>
                                        <Checkbox
                                          type="checkbox"
                                          name={`${todo.id}-${todo.date}`}
                                          id={`${todo.id}-${todo.date}`}
                                          onChange={(value: any) => {
                                            if (value.target.value === "true") {
                                              const todoIds =
                                                values.selectedTaskIds.filter(
                                                  (id: number) => id !== todo.id
                                                );
                                              values.selectedTaskIds = todoIds;
                                            } else {
                                              values.selectedTaskIds.push(
                                                todo.id
                                              );
                                            }
                                          }}
                                        />
                                      </td>
                                      <td>{todo.task}</td>
                                      {todo.status === "active" ? (
                                        <td>Active</td>
                                      ) : (
                                        <td style={{ color: "red" }}>
                                          Inactive
                                        </td>
                                      )}

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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          }}
        </Formik>
      </>
    </>
  );
};

export default TodoList;

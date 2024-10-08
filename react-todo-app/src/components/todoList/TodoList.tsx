import React, { useEffect, useState } from "react";
import {
  addTodo,
  addTodos,
  deleteSelectedTodos,
  deleteTodo,
  deleteTodos,
  getTodos,
  updateTodo,
} from "../../services/todosServices";
import "./todoList.scss";
import { FieldArray, Form, Formik } from "formik";
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
  AddMultipleTodoModal,
  DeleteAllTodosModal,
  DeleteSelectedTodosModal,
  DeleteTodoModal,
  EditTodoModal,
} from "./todoModal";
import { ACTIONS_ERROR_MESSAGE } from "../../constants/globalText";
import { format } from "date-fns";
import {
  GlobalErrorMessage,
  GlobalSuccessMessage,
} from "../errorAndSuccessMessage/ErrorAndSuccessMessage";
import { LoadingData } from "../loading";
import { Checkbox } from "../fieds/checkbox";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store";
import {
  showErrorPopup,
  showIsLoading,
  showSucessPopup,
} from "../../redux-toolkit/reducers/popupSlice";

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
  const [addMultipleTodoModal, setAddMultipleTodoModal] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const filterParam = searchParams.get("filter");
  const statusParam = searchParams.get("status");
  const pageParam = searchParams.get("page");

  const popupSlice = useSelector((state: RootState) => state.popupSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      dispatch(showIsLoading(true));
      getTodos({
        filter: filterParam || "",
        status: statusParam || "",
        page: (pageParam && parseInt(pageParam)) || 1,
      })
        .then((response) => {
          if (isSubscribed) {
            setTodos(response.data);
            dispatch(showIsLoading(false));
          }
        })
        .catch((error) => {
          dispatch(
            showErrorPopup({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
            })
          );
          dispatch(showIsLoading(false));
        });
    };
    getTodosList();
    return () => {
      isSubscribed = false;
    };
  }, [dispatch, filterParam, pageParam, statusParam]);

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

  const addMultipleTodoData = async (values: { tasks: string[] }) => {
    const tasks = values.tasks.filter((task: string) => task.length);
    addTodos(tasks)
      .then((response) => {
        let message = "Lists created successfully!";
        if (response.data.existedTasks.length)
          message = `Lists created successfully, but ${response.data.existedTasks}`;
        dispatch(
          showSucessPopup({
            status: true,
            message: `${message}`,
          })
        );
        getTodosData();
        closeModal();
      })
      .catch((error) => {
        if (error.response.status === 409) {
          dispatch(
            showErrorPopup({
              status: true,
              message: error.response.data.error,
            })
          );
        } else if (error.response.status === 400) {
          dispatch(
            showErrorPopup({
              status: true,
              message: error.response.data.error,
            })
          );
        } else {
          dispatch(
            showErrorPopup({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
            })
          );
        }
        dispatch(showIsLoading(false));
      });
  };

  const editTodoData = async (todo: {
    id: number;
    task: string;
    status: string;
  }) => {
    await updateTodo(todo.id, todo)
      .then((response) => {
        dispatch(
          showSucessPopup({
            status: true,
            message: "Task updated successfully!",
          })
        );
        getTodosData();
        closeModal();
      })
      .catch((error) => {
        if (error.response.status === 409) {
          dispatch(
            showErrorPopup({
              status: true,
              message: error.response.data.error,
            })
          );
        } else if (error.response.status === 400) {
          dispatch(
            showErrorPopup({
              status: true,
              message: error.response.data.error,
            })
          );
        } else {
          dispatch(
            showErrorPopup({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
            })
          );
        }
        dispatch(showIsLoading(false));
      });
  };

  const deleteAllTodosData = async () => {
    dispatch(showIsLoading(true));
    deleteTodos()
      .then((response) => {
        dispatch(
          showSucessPopup({
            status: true,
            message: `All lists deleted successfully!`,
          })
        );
        getTodosData();
        closeModal();
      })
      .catch((error) => {
        dispatch(
          showErrorPopup({ status: true, message: ACTIONS_ERROR_MESSAGE })
        );
        dispatch(showIsLoading(false));
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
    dispatch(showIsLoading(false));
    setTodo({
      id: 0,
      task: "",
      status: "",
    });
    dispatch(showErrorPopup({ status: false, message: "" }));
    setEditTodoModal(false);
    setAddMultipleTodoModal(false);
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
              dispatch(showIsLoading(true));
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

                  dispatch(
                    showSucessPopup({
                      status: true,
                      message: `List deleted successfully!`,
                    })
                  );

                  getTodosData();
                  closeModal();
                })
                .catch((error) => {
                  dispatch(
                    showErrorPopup({
                      status: true,
                      message: ACTIONS_ERROR_MESSAGE,
                    })
                  );
                  dispatch(showIsLoading(false));
                });
            };

            const deleteSelectedTodosData = async (values: []) => {
              dispatch(showIsLoading(true));
              await deleteSelectedTodos(values)
                .then((response) => {
                  dispatch(
                    showSucessPopup({
                      status: true,
                      message: `Selected ${
                        values.length > 1 ? "lists" : "list"
                      }  deleted successfully!`,
                    })
                  );
                  getTodosData();
                  dispatch(showIsLoading(false));
                  setFieldValue("deleteSelectedTodosModal", false);
                  setFieldValue("selectedTaskIds", []);
                })
                .catch((error) => {
                  dispatch(
                    showErrorPopup({
                      status: true,
                      message: ACTIONS_ERROR_MESSAGE,
                    })
                  );
                  dispatch(showIsLoading(false));
                });
            };

            const addTodoData = async () => {
              await addTodo(values)
                .then((response) => {
                  dispatch(
                    showSucessPopup({
                      status: true,
                      message: "Task added successfully!",
                    })
                  );
                  setFieldValue("task", "");
                  getTodosData();
                })
                .catch((error) => {
                  if (error.response.status === 409) {
                    dispatch(
                      showErrorPopup({
                        status: true,
                        message: error.response.data.error,
                      })
                    );
                  } else if (error.response.status === 400) {
                    dispatch(
                      showErrorPopup({
                        status: true,
                        message: error.response.data.error,
                      })
                    );
                  } else {
                    dispatch(
                      showErrorPopup({
                        status: true,
                        message: ACTIONS_ERROR_MESSAGE,
                      })
                    );
                  }
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
                                {popupSlice.errorPopup.status && (
                                  <>
                                    <GlobalErrorMessage
                                      message={popupSlice.errorPopup.message}
                                    />
                                  </>
                                )}
                                {popupSlice.isLoading && <LoadingData />}

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

                  {addMultipleTodoModal && (
                    <AddMultipleTodoModal
                      show={addMultipleTodoModal}
                      handleClose={() => closeModal()}
                      formikData={
                        <Formik
                          initialValues={{ tasks: [""] }}
                          onSubmit={addMultipleTodoData}
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
                                <FieldArray
                                  name="tasks"
                                  render={(arrayHelpers) => {
                                    return (
                                      <div>
                                        {values.tasks.map((task, index) => (
                                          <div
                                            key={index}
                                            className="row add-tasks"
                                          >
                                            <div className="col-sm-10">
                                              <InputField
                                                style={{ borderRadius: 0 }}
                                                placeholder="Task"
                                                name={`tasks.${index}`}
                                                id={`tasks.${index}`}
                                                onBlur={handleBlur(
                                                  `tasks.${index}`
                                                )}
                                                autoCapitalize="none"
                                                onChange={handleChange(
                                                  `tasks.${index}`
                                                )}
                                              />
                                            </div>

                                            <div
                                              className="col-sm-2"
                                              style={{ textAlign: "right" }}
                                            >
                                              <div>
                                                {values.tasks.length ===
                                                index + 1 ? (
                                                  <GlobalButton
                                                    disabled={
                                                      values.tasks[index]
                                                        ? false
                                                        : true
                                                    }
                                                    onClick={() => {
                                                      if (values.tasks.length) {
                                                        arrayHelpers.insert(
                                                          values.tasks.length +
                                                            1,
                                                          ""
                                                        );
                                                      } else {
                                                        arrayHelpers.push("");
                                                      }
                                                    }}
                                                  >
                                                    <FaPlus />
                                                  </GlobalButton>
                                                ) : (
                                                  <GlobalButton
                                                    onClick={() => {
                                                      arrayHelpers.remove(
                                                        index
                                                      );
                                                    }}
                                                    format="danger"
                                                  >
                                                    <FaMinus />
                                                  </GlobalButton>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                        <div
                                          className="global-modal-flex-row-wrap"
                                          style={{ marginTop: 30 }}
                                        >
                                          <div className="global-modal-left">
                                            <GlobalButton
                                              format="white"
                                              size="sm"
                                              onClick={() => closeModal()}
                                            >
                                              Cancel
                                            </GlobalButton>
                                          </div>
                                          <div>
                                            <GlobalButton
                                              format="success"
                                              type="submit"
                                              size="sm"
                                              disabled={
                                                values.tasks.filter(
                                                  (task: string) => task.length
                                                ).length
                                                  ? false
                                                  : true
                                              }
                                            >
                                              Submit
                                            </GlobalButton>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }}
                                />
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
                                disabled={values.task ? false : true}
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
                              <span style={{ marginRight: 20 }}>
                                <GlobalButton
                                  size="sm"
                                  onClick={() => {
                                    setAddMultipleTodoModal(true);
                                    // navigate("/");
                                  }}
                                >
                                  Add Multiple
                                </GlobalButton>
                              </span>
                              <span>
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
                              </span>
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
                      {popupSlice.errorPopup.status && (
                        <>
                          <GlobalErrorMessage
                            message={popupSlice.errorPopup.message}
                          />
                        </>
                      )}
                    </div>

                    <div className="">
                      <div className="row">
                        <div className="success-message">
                          {popupSlice.successPopup.status && (
                            <>
                              <GlobalSuccessMessage
                                message={popupSlice.successPopup.message}
                              />
                            </>
                          )}
                        </div>
                        <div className="col-sm-12">
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

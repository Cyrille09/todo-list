import React, { useEffect, useState } from "react";
import {
  addTodo,
  deleteSelectedTodos,
  getTodos,
} from "../../services/todosServices";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { InputField } from "../fieds/inputField";
import { GlobalButton } from "../button/GlobalButton";
import { todoForm } from "../formValidation/formValidation";
import { Table } from "react-bootstrap";
import { KeyValueCard } from "../cards";
import { ReactSelect } from "../fieds/GlobalSelect";
import { SearchField } from "../fieds/SearchField";
import { Pagination } from "../pagination/pagination";
import { ACTIONS_ERROR_MESSAGE } from "../../constants/globalText";
import { format } from "date-fns";
import {
  GlobalErrorMessage,
  GlobalSuccessMessage,
} from "../errorAndSuccessMessage/ErrorAndSuccessMessage";
import { Checkbox } from "../fieds/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store";
import {
  hidePopup,
  showAddTodosPopup,
  showDeleteSelectedTodosPopup,
  showDeleteTodoPopup,
  showDeleteTodosPopup,
  showEditTodosPopup,
  showErrorPopup,
  showIsLoading,
  showSucessPopup,
} from "../../redux-toolkit/reducers/popupSlice";
import TodoActions from "./TodoActions";
import { setTodosRecord } from "../../redux-toolkit/reducers/todosSlice";
import { DefaultTodo, TodoInterface } from "../globalTypes/GlobalTypes";
import "./todoList.scss";

const TodoList: React.FC = () => {
  const [todo, setTodo] = useState<TodoInterface>(DefaultTodo);
  const searchParams = new URLSearchParams(window.location.search);
  const filterParam = searchParams.get("filter");
  const statusParam = searchParams.get("status");
  const pageParam = searchParams.get("page");

  const popupSlice = useSelector((state: RootState) => state.popupSlice);
  const todosSlice = useSelector((state: RootState) => state.todosSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pageCount = Math.ceil(
    todosSlice.todos.total / todosSlice.todos.perPage
  );

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
            dispatch(showIsLoading(false));
            dispatch(setTodosRecord(response.data));
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
        dispatch(setTodosRecord(response.data));
      })
      .catch((error) => {});
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

  return (
    <>
      <Formik
        initialValues={{
          status: "all",
          todos: "",
          task: "",
          selectedTaskIds: [] as any,
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
                dispatch(hidePopup({}));
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

          return (
            <>
              <div>
                <TodoActions
                  todo={todo}
                  values={values}
                  filterParam={filterParam}
                  statusParam={statusParam}
                  pageParam={pageParam}
                  deleteSelectedTodosData={deleteSelectedTodosData}
                />
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
                              className="add-btn"
                            >
                              Add
                            </GlobalButton>
                          </div>
                        </div>
                        {(todosSlice.todos.total &&
                          !values.selectedTaskIds.length && (
                            <div
                              className="col-sm-4"
                              style={{ textAlign: "right" }}
                            >
                              <span style={{ marginRight: 20 }}>
                                <GlobalButton
                                  size="sm"
                                  onClick={() => {
                                    dispatch(showAddTodosPopup(true));
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
                                    dispatch(showDeleteTodosPopup(true));
                                    navigate("/");
                                  }}
                                >
                                  Delete All
                                </GlobalButton>
                              </span>
                            </div>
                          )) ||
                          null}

                        {(todosSlice.todos.total &&
                          values.selectedTaskIds.length && (
                            <div
                              className="col-sm-4"
                              style={{ textAlign: "right" }}
                            >
                              <GlobalButton
                                size="sm"
                                format="danger"
                                onClick={() => {
                                  dispatch(showDeleteSelectedTodosPopup(true));
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
                              {todosSlice.todos?.todos?.map(
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
                                      <td style={{ color: "red" }}>Inactive</td>
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
                                          dispatch(showEditTodosPopup(true));
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
                                          dispatch(showDeleteTodoPopup(true));
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
                          {!todosSlice.todos?.todos.length && (
                            <div className="no-record">
                              <p>No Task</p>
                            </div>
                          )}
                          <div>
                            <Pagination
                              pageCount={pageCount}
                              perPage={todosSlice.todos.perPage}
                              forcePage={Number(pageParam || 1)}
                              handlePageClick={changePage}
                              total={todosSlice.todos.total}
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
  );
};

export default TodoList;

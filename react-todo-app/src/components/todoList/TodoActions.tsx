import { useDispatch, useSelector } from "react-redux";
import {
  hidePopup,
  showErrorPopup,
  showIsLoading,
  showSucessPopup,
} from "../../redux-toolkit/reducers/popupSlice";
import {
  addTodos,
  deleteTodo,
  deleteTodos,
  getTodos,
  updateTodo,
} from "../../services/todosServices";
import { GlobalButton } from "../button/GlobalButton";
import {
  AddMultipleTodoModal,
  DeleteAllTodosModal,
  DeleteSelectedTodosModal,
  DeleteTodoModal,
  EditTodoModal,
} from "./todoModal";
import { ACTIONS_ERROR_MESSAGE } from "../../constants/globalText";
import { RootState } from "../../redux-toolkit/store";
import { FieldArray, Form, Formik } from "formik";
import { InputField } from "../fieds/inputField";
import { GlobalErrorMessage } from "../errorAndSuccessMessage/ErrorAndSuccessMessage";
import { LoadingData } from "../loading";
import { editTodoForm } from "../formValidation/formValidation";
import { ReactSelect } from "../fieds/GlobalSelect";
import { FaMinus, FaPlus } from "react-icons/fa";
import { setTodosRecord } from "../../redux-toolkit/reducers/todosSlice";
import { TodoInterface } from "../globalTypes/GlobalTypes";

interface TodoActionsProps {
  todo: TodoInterface;
  values: any;
  filterParam: string | null;
  statusParam: string | null;
  pageParam: string | null;
  deleteSelectedTodosData: (event: any) => void;
}

const TodoActions = ({
  todo,
  values,
  filterParam,
  statusParam,
  pageParam,
  deleteSelectedTodosData,
}: TodoActionsProps) => {
  const popupSlice = useSelector((state: RootState) => state.popupSlice);
  const dispatch = useDispatch();

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
    dispatch(hidePopup({}));
  };
  return (
    <div>
      {/* delete todo task */}
      {popupSlice.deleteTodoPopup && (
        <DeleteTodoModal
          show={popupSlice.deleteTodoPopup}
          handleClose={closeModal}
          todo={todo}
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

      {/* delete all todos task */}
      {popupSlice.deleteTodosPopup && (
        <DeleteAllTodosModal
          show={popupSlice.deleteTodosPopup}
          handleClose={closeModal}
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

      {/* edit todo task */}
      {popupSlice.editTodoPopup && (
        <EditTodoModal
          show={popupSlice.editTodoPopup}
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
                          (c: { value: string }) => c.value === values.status
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
                        <GlobalButton format="success" type="submit" size="sm">
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

      {/* delete selected task */}
      {popupSlice.deleteSelectedTodosPopup && (
        <DeleteSelectedTodosModal
          show={popupSlice.deleteSelectedTodosPopup}
          handleClose={() => {
            closeModal();
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
                    }}
                  >
                    No
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    onClick={() =>
                      deleteSelectedTodosData(values.selectedTaskIds)
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

      {/* add multiple tasks */}
      {popupSlice.addTodosPopup && (
        <AddMultipleTodoModal
          show={popupSlice.addTodosPopup}
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
                              <div key={index} className="row add-tasks">
                                <div className="col-sm-10">
                                  <InputField
                                    style={{ borderRadius: 0 }}
                                    placeholder="Task"
                                    name={`tasks.${index}`}
                                    id={`tasks.${index}`}
                                    onBlur={handleBlur(`tasks.${index}`)}
                                    autoCapitalize="none"
                                    onChange={handleChange(`tasks.${index}`)}
                                  />
                                </div>

                                <div
                                  className="col-sm-2"
                                  style={{ textAlign: "right" }}
                                >
                                  <div>
                                    {values.tasks.length === index + 1 ? (
                                      <GlobalButton
                                        disabled={
                                          values.tasks[index] ? false : true
                                        }
                                        onClick={() => {
                                          if (values.tasks.length) {
                                            arrayHelpers.insert(
                                              values.tasks.length + 1,
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
                                          arrayHelpers.remove(index);
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
  );
};

export default TodoActions;

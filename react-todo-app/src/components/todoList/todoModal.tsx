import { GlobalModal } from "../modal";
import { LoadingData } from "../loading";
import { GlobalErrorMessage } from "../errorAndSuccessMessage";
import React from "react";

export const DeleteTodoModal = ({
  footer,
  show,
  handleClose,
  todo,
  isLoading,
  errorMessagePopup,
}: {
  footer?: React.ReactNode;
  show: boolean;
  handleClose: () => void;
  todo: { id: number; task: string; status: string };
  isLoading: boolean;
  errorMessagePopup: { status: boolean; message: string };
}) => {
  return (
    <GlobalModal title="Delete Todo List" show={show} handleClose={handleClose}>
      <div className={"global-modal"}>
        {errorMessagePopup.status && (
          <>
            <GlobalErrorMessage
              message={errorMessagePopup.message}
              status={errorMessagePopup.status}
            />
          </>
        )}
        <p>
          Are you sure you want to delete <b>{todo.task}</b> todo list?
        </p>

        {isLoading && <LoadingData />}

        {footer && <div className="global-modal-footer">{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const DeleteAllTodosModal = ({
  footer,
  show,
  handleClose,
  isLoading,
  errorMessagePopup,
}: {
  footer?: React.ReactNode;
  show: boolean;
  handleClose: () => void;
  isLoading: boolean;
  errorMessagePopup: { status: boolean; message: string };
}) => {
  return (
    <GlobalModal
      title="Delete All Todos List"
      show={show}
      handleClose={handleClose}
    >
      <div className={"global-modal"}>
        {errorMessagePopup.status && (
          <>
            <GlobalErrorMessage
              message={errorMessagePopup.message}
              status={errorMessagePopup.status}
            />
          </>
        )}
        <p>Are you sure you want to delete all todo list?</p>

        {isLoading && <LoadingData />}

        {footer && <div className="global-modal-footer">{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const DeleteSelectedTodosModal = ({
  footer,
  show,
  handleClose,
  isLoading,
  errorMessagePopup,
}: {
  footer?: React.ReactNode;
  show: boolean;
  handleClose: () => void;
  isLoading: boolean;
  errorMessagePopup: { status: boolean; message: string };
}) => {
  return (
    <GlobalModal
      title="Delete Selected Todos List"
      show={show}
      handleClose={handleClose}
    >
      <div className={"global-modal"}>
        {errorMessagePopup.status && (
          <>
            <GlobalErrorMessage
              message={errorMessagePopup.message}
              status={errorMessagePopup.status}
            />
          </>
        )}
        <p>Are you sure you want to delete the selected todo list?</p>

        {isLoading && <LoadingData />}

        {footer && <div className="global-modal-footer">{footer}</div>}
      </div>
    </GlobalModal>
  );
};

/**
 * Edit todo list
 */
export const EditTodoModal = ({
  footer,
  show,
  handleClose,
  formikData,
}: {
  footer?: React.ReactNode;
  show: boolean;
  handleClose: () => void;
  formikData: React.ReactNode;
}) => {
  return (
    <GlobalModal title="Update Todo List" show={show} handleClose={handleClose}>
      <div className={"global-modal"}>{formikData}</div>
    </GlobalModal>
  );
};

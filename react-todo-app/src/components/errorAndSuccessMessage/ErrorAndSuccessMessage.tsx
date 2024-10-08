import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { DEFAULT_ERROR_SUCCESS_POPUP } from "../../constants/defaultValues";
import {
  showErrorPopup,
  showSucessPopup,
} from "../../redux-toolkit/reducers/popupSlice";
// styles components
import type { RootState } from "../../redux-toolkit/store";
import { DefaultPopupMessage } from "../globalTypes/GlobalTypes";
import styles from "./errorAndSuccessMessage.module.scss";

export const GlobalErrorMessage = ({ message }: { message: string }) => {
  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  const actions = useSelector((state: RootState) => state.popupSlice);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(showErrorPopup({ ...DefaultPopupMessage }));
    }, DEFAULT_ERROR_SUCCESS_POPUP);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  return (
    <CSSTransition
      in={actions.errorPopup.status}
      nodeRef={nodeRef}
      timeout={100}
      classNames="panel-animate"
      unmountOnExit={true}
      mountOnEnter={true}
      onEnter={() => document.body.classList.add("css-transition-modal-open")}
      onExited={() =>
        document.body.classList.remove("css-transition-modal-open")
      }
    >
      <div className={styles.message} role="alert">
        {message}
      </div>
    </CSSTransition>
  );
};

export const GlobalSuccessMessage = ({ message }: { message: string }) => {
  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  const actions = useSelector((state: RootState) => state.popupSlice);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(showSucessPopup({ ...DefaultPopupMessage }));
    }, DEFAULT_ERROR_SUCCESS_POPUP);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  return (
    <CSSTransition
      in={actions.successPopup.status}
      nodeRef={nodeRef}
      timeout={100}
      classNames="panel-animate"
      unmountOnExit={true}
      mountOnEnter={true}
      onEnter={() => document.body.classList.add("css-transition-modal-open")}
      onExited={() =>
        document.body.classList.remove("css-transition-modal-open")
      }
    >
      <div className={styles.successMessage} role="alert">
        {message}
      </div>
    </CSSTransition>
  );
};

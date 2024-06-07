import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./errorAndSuccessMessage.module.scss";

export const GlobalErrorMessage = ({
  message,
  status,
}: {
  message: string;
  status: boolean;
}) => {
  const nodeRef = useRef(null);
  const [errorPopup, setErrorPopup] = useState<{
    status: boolean;
    message: string;
    display: string;
  }>({ status, message: "", display: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorPopup({ status: false, message: "", display: "" });
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <CSSTransition
      in={errorPopup.status}
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

export const GlobalSuccessMessage = ({
  message,
  status,
}: {
  message: string;
  status: boolean;
}) => {
  const nodeRef = useRef(null);
  const [successPopup, setSuccessPopup] = useState<{
    status: boolean;
    message: string;
    display: string;
  }>({ status, message: "", display: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessPopup({ status: false, message: "", display: "" });
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <CSSTransition
      in={successPopup.status}
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

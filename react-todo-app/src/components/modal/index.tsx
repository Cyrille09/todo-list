import Modal from "react-bootstrap/Modal";
import classnames from "classnames";
import React from "react";

// style components
interface ModalProps {
  size?: "sm" | "lg" | "xl";
  backdrop?: "static" | true | false;
  centered?: true | false;
  scrollable?: true | false;
  fullscreen?:
    | true
    | "sm-down"
    | "md-down"
    | "lg-down"
    | "xl-down"
    | "xxl-down";
  title?: string;
  show: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

export const GlobalModal = ({
  size,
  backdrop = true,
  centered = true,
  scrollable = false,
  fullscreen,
  title,
  show,
  handleClose,
  children,
}: ModalProps) => {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size={size}
        backdrop={backdrop}
        centered={centered}
        fullscreen={fullscreen}
        className={classnames(scrollable ? "modal-dialog-scrollable" : "")}
      >
        <div>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          {children}
        </div>
      </Modal>
    </>
  );
};

import React from "react";

function LeaveConfirmationModal({ show, children }) {
  if (!show) {
    return null;
  } else {
    return (
      <div className="modal">
        <div className="modal-content">{children}</div>
      </div>
    );
  }
}

export default LeaveConfirmationModal;

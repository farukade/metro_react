import { KTIcon } from "../../../helpers/components/KTIcon";

const ConfirmationModal = (props: {
  message: string;
  action: Function;
  close: Function;
}) => {
  const { message, action, close } = props;
  return (
    <div
      className={`modal fade show`}
      tabIndex={-1}
      role="dialog"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        content: "",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="modal-dialog mw-550px" role="document">
        <div className="modal-content" style={{ padding: "50px" }}>
          <ul className="swal2-progress-steps" style={{ display: "none" }}></ul>
          <div
            className="swal2-icon swal2-warning swal2-icon-show"
            style={{ display: "flex" }}
          ></div>
          <img className="swal2-image" style={{ display: "none" }} />
          <h2
            className="swal2-title"
            id="swal2-title"
            style={{ display: "none" }}
          ></h2>
          <div
            className="swal2-html-container"
            id="swal2-html-container"
            style={{ display: "block", margin: "30px" }}
          >
            {message}
          </div>
          <input className="swal2-input" style={{ display: "none" }} />
          <input
            type="file"
            className="swal2-file"
            style={{ display: "none" }}
          />
          <div className="swal2-range" style={{ display: "none" }}>
            <input type="range" />
            <output></output>
          </div>
          <select className="swal2-select" style={{ display: "none" }}></select>
          <div className="swal2-radio" style={{ display: "none" }}></div>
          <label className="swal2-checkbox" style={{ display: "none" }}>
            <input type="checkbox" />
            <span className="swal2-label"></span>
          </label>
          <textarea
            className="swal2-textarea"
            style={{ display: "none" }}
          ></textarea>
          <div
            className="swal2-validation-message"
            id="swal2-validation-message"
            style={{ display: "none" }}
          ></div>
          <div
            className="swal2-actions"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="swal2-loader"></div>
            <button
              type="button"
              className="swal2-confirm btn btn-primary"
              aria-label=""
              style={{ display: "inline-block" }}
              onClick={() => {
                action();
                close();
              }}
            >
              Yes, continue!
            </button>
            <button
              type="button"
              className="swal2-cancel btn btn-active-light"
              aria-label=""
              style={{ display: "inline-block" }}
              onClick={() => {
                close();
              }}
            >
              No, return
            </button>
          </div>
          <div className="swal2-footer" style={{ display: "none" }}></div>
          <div className="swal2-timer-progress-bar-container">
            <div
              className="swal2-timer-progress-bar"
              style={{ display: "none" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

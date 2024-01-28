import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { KTIcon } from "../../../helpers";
import { updateUserItem } from "../../../../app/modules/auth/core/_requests";
import { useAuth } from "../../../../app/modules/auth";
import { startCase } from "lodash";

const UpdateItem = (props: {
  setUpdateItemOpen: Dispatch<SetStateAction<boolean>>;
  setItemName: Dispatch<SetStateAction<string>>;
  setItemValue: Dispatch<SetStateAction<number>>;
  updateItemOpen: boolean;
  itemName: string;
  itemValue: number;
}) => {
  const { setUpdateItemOpen, updateItemOpen, itemName, itemValue } = props;
  const [newValue, setNewValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const { currentUser, setCurrentUser } = useAuth();

  const addTransaction = async () => {
    try {
      setSubmitting(true);
      setStatus("");
      const data = { [itemName]: newValue };
      const { data: rs } = await updateUserItem(data, currentUser);

      if (rs?.success) {
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            ...rs.data,
          });
        } else {
          setCurrentUser({
            ...rs.data,
          });
        }
        setTimeout(() => {
          setUpdateItemOpen(false);
        }, 300);
      } else {
        setStatus(rs.message || "Submission failed!");
        setSubmitting(false);
      }
    } catch (error: any) {
      setStatus(error?.message || "Submission failed!");
      setSubmitting(false);
      console.log(error);
    }
  };

  return (
    <div
      className={`modal ${updateItemOpen ? "fade show" : ""}`}
      tabIndex={-1}
      role="dialog"
      style={{
        display: updateItemOpen ? "block" : "",
        content: "",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingTop: "50px",
      }}
    >
      <div className="modal-dialog mx-250px" role="document">
        <div className="modal-content">
          <div className="modal-header pb-0 border-0 justify-content-end">
            <div className="btn btn-sm btn-icon btn-active-color-primary">
              <div
                onClick={() => {
                  setUpdateItemOpen(false);
                }}
              >
                <KTIcon iconName="cross" className="fs-1" />
              </div>
            </div>
          </div>

          <div className="modal-body mx-5 mx-xl-10 pt-0 pb-15">
            <div className="text-center mb-13">
              <h1 className="mb-3">{`Update ${startCase(itemName)}`}</h1>
            </div>

            {status && (
              <div className="mb-lg-15 alert alert-danger">
                <div className="alert-text font-weight-bold">{status}</div>
              </div>
            )}

            <div className="mb-10">
              <div className="mh-300px me-n7 pe-7" style={{ fontSize: "15px" }}>
                <div className="m-3 form-group d-flex justify-content-between align-items-center">
                  <label>New Value</label>
                  <input
                    className="form-control"
                    type="text"
                    value={newValue}
                    onChange={(e) => {
                      if (typeof Number(e.target?.value) === "number") {
                        setNewValue(Number(e.target?.value));
                      }
                    }}
                    style={{ width: "60%", marginBottom: "10px" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              {submitting ? (
                <span
                  className="btn btn-sm btn-primary indicator-progress"
                  style={{ display: "block" }}
                >
                  <KTIcon iconName="document" className="fs-3" />
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              ) : (
                <a
                  href="#"
                  className="btn btn-sm btn-primary"
                  onClick={addTransaction}
                >
                  <KTIcon iconName="document" className="fs-3" />
                  Submit
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UpdateItem };

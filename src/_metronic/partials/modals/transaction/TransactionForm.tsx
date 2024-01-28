import { Dispatch, SetStateAction, CSSProperties, useState } from "react";
import { KTIcon } from "../../../helpers";
import { postTransaction } from "../../../../app/modules/auth/core/_requests";
import { TransactionModel, useAuth } from "../../../../app/modules/auth";
import DatePicker from "react-datepicker";

const TransactionForm = (props: {
  setTransactionOpen: Dispatch<SetStateAction<boolean>>;
  setTransactions: Dispatch<SetStateAction<TransactionModel[]>>;
  transactions: TransactionModel[];
  transactionOpen: boolean;
}) => {
  const { setTransactionOpen, transactionOpen, setTransactions, transactions } =
    props;
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [unitValue, setUnitValue] = useState(0);
  const [mode, setMode] = useState("");
  const [time, setTime] = useState<Date | null>(new Date());

  const { currentUser } = useAuth();

  const addTransaction = async () => {
    try {
      if (!date) {
        setStatus("Please select date!");
        return;
      }
      if (!description) {
        setStatus("Please add description!");
        return;
      }
      if (!amount) {
        setStatus("Please add a valid amount!");
        return;
      }
      if (!mode) {
        setStatus("Please add mode of payment!");
        return;
      }
      if (!unitValue) {
        setStatus("Please add a valid quantity of units!");
        return;
      }

      setSubmitting(true);
      setStatus("");

      const datetime = new Date(
        `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${time?.getHours()}:${time?.getMinutes()}`
      );
      const { data: rs } = await postTransaction(
        {
          date: datetime,
          description,
          amount,
          mode,
          unitValue,
        },
        currentUser
      );

      if (rs?.success) {
        setDate(new Date());
        setDescription("");
        setAmount(0);
        setUnitValue(0);
        setMode("");
        setSubmitting(false);
        setTransactions([rs.data, ...transactions]);
        setTimeout(() => {
          setTransactionOpen(false);
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
      className={`modal ${transactionOpen ? "fade show" : ""}`}
      tabIndex={-1}
      role="dialog"
      style={{
        display: transactionOpen ? "block" : "",
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
      <div className="modal-dialog mw-650px" role="document">
        <div className="modal-content">
          <div className="modal-header pb-0 border-0 justify-content-end">
            <div className="btn btn-sm btn-icon btn-active-color-primary">
              <div
                onClick={() => {
                  setTransactionOpen(false);
                }}
              >
                <KTIcon iconName="cross" className="fs-1" />
              </div>
            </div>
          </div>

          <div className="modal-body mx-5 mx-xl-10 pt-0 pb-15">
            <div className="text-center mb-13">
              <h1 className="mb-3">Add Transaction</h1>
            </div>

            {status && (
              <div className="mb-lg-15 alert alert-danger">
                <div className="alert-text font-weight-bold">{status}</div>
              </div>
            )}

            <div className="mb-10">
              <div className="mh-300px me-n7 pe-7" style={{ fontSize: "15px" }}>
                <div className="m-3 form-group d-flex justify-content-between align-items-center">
                  <label>Date Time</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      width: "65%",
                      marginBottom: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ width: "60%" }}>
                      <DatePicker
                        isClearable
                        className="form-control single-daterange"
                        dateFormat="dd-MMM-yyyy"
                        selected={date}
                        onChange={(e) => {
                          setDate(e);
                        }}
                      />
                    </div>
                    <div style={{ width: "30%" }}>
                      <DatePicker
                        className="single-daterange form-control"
                        showTimeSelectOnly
                        showTimeSelect
                        dropdownMode="select"
                        dateFormat="HH:mm"
                        selected={time}
                        onChange={(e) => {
                          setTime(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="m-3 form-group d-flex justify-content-between align-items-center">
                  <label>Description</label>
                  <textarea
                    className="form-control form-control-solid"
                    placeholder="Type or paste text here"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target?.value);
                    }}
                    style={{
                      width: "65%",
                      minHeight: "60px",
                      maxHeight: "60px",
                      marginBottom: "10px",
                    }}
                  ></textarea>
                </div>
                <div className="m-3 form-group d-flex justify-content-between align-items-center">
                  <label>Amount</label>
                  <input
                    className="form-control"
                    type="number"
                    defaultValue={""}
                    onChange={(e) => {
                      setAmount(Number(e.target?.value));
                    }}
                    style={{ width: "65%", marginBottom: "10px" }}
                  />
                </div>
                <div className="m-3 form-group d-flex justify-content-between align-items-center">
                  <label>Payment mode</label>
                  <input
                    className="form-control"
                    type="text"
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target?.value);
                    }}
                    style={{ width: "65%", marginBottom: "10px" }}
                  />
                </div>
                <div className="m-3 form-group d-flex justify-content-between align-items-center">
                  <label>Unit Value</label>
                  <input
                    className="form-control"
                    type="number"
                    defaultValue={""}
                    onChange={(e) => {
                      setUnitValue(Number(e.target?.value));
                    }}
                    style={{ width: "65%", marginBottom: "10px" }}
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

export { TransactionForm };

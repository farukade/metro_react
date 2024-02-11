import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { KTIcon, formatCurrency } from "../../../helpers";
import { TransactionModel, useAuth } from "../../../../app/modules/auth";
import { request } from "../../../../app/modules/auth/core/_requests";
import moment from "moment";
import CustomPagination from "../../../helpers/components/Pagination";
import { ConfirmationType } from "../../../layout/core";

type Props = {
  className: string;
  transactions: TransactionModel[];
  setTransactions: Dispatch<SetStateAction<TransactionModel[]>>;
  setTransaction: Dispatch<SetStateAction<TransactionModel | null>>;
  setTransactionOpen: Dispatch<SetStateAction<boolean>>;
  setConfirmation: Dispatch<SetStateAction<ConfirmationType | null>>;
  setMeta: Dispatch<SetStateAction<any>>;
  meta?: any;
};

const TablesWidget9: React.FC<Props> = ({
  className,
  setTransactionOpen,
  transactions,
  setTransactions,
  setTransaction,
  setMeta,
  setConfirmation,
  meta,
}) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [limit] = useState(8);

  const getTransactions = useCallback(async (page = 1) => {
    try {
      document.body.classList.add("page-loading");

      const url = `transaction?page=${page}&limit=${limit}`;
      const {
        success,
        message,
        paging,
        result: rs,
      } = await request(url, "GET", true, null);
      if (success) {
        const { result, ...rest } = rs;
        document.body.classList.remove("page-loading");
        setTransactions(result);
        if (currentUser) {
          setCurrentUser({ ...currentUser, ...rest });
        }
        setMeta(paging);
      } else {
        document.body.classList.remove("page-loading");
        console.log(message || "Error fetching transactions!");
      }
    } catch (error: any) {
      document.body.classList.remove("page-loading");
      console.log(error);
    }
  }, []);

  const deleteTransaction = async (item: TransactionModel) => {
    try {
      document.body.classList.add("page-loading");

      if (!item.id) {
        return;
      }

      const url = `transaction?id=${item.id}`;
      const { success, message } = await request(url, "DELETE", true, null);
      if (success) {
        document.body.classList.remove("page-loading");
        let newData: any = [];
        for (const transaction of transactions) {
          if (transaction.id !== item.id) {
            newData = [...newData, transaction];
          }
        }
        setTransactions(newData);
        if (meta && meta.totalItems) {
          setMeta({ ...meta, totalItems: meta.totalItems - 1 });
        }
      } else {
        document.body.classList.remove("page-loading");
        console.log(message || "Error deleting transaction");
      }
    } catch (error: any) {
      document.body.classList.remove("page-loading");
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Transaction History
          </span>
        </h3>
        <div
          className="card-toolbar"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-trigger="hover"
          title="Click to add a user"
        >
          {currentUser?.type === "admin" && (
            <a
              href="#"
              className="btn btn-sm btn-light-primary"
              onClick={() => {
                setTransactionOpen(true);
              }}
            >
              <KTIcon iconName="plus" className="fs-3" />
              New Transaction
            </a>
          )}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body py-3">
        {/* begin::Table container */}
        <div className="table-responsive">
          {/* begin::Table */}
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            {/* begin::Table head */}
            <thead>
              <tr className="fw-bold text-muted">
                <th className="min-w-100px">Date</th>
                <th className="min-w-100px">Cost</th>
                <th className="min-w-200px">Details</th>
                <th className="min-w-120px">Mode</th>
                <th className="min-w-100px">Unit</th>
                {currentUser?.type === "admin" && (
                  <th className="min-w-100px text-end">Actions</th>
                )}
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {transactions?.map((transaction, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="d-flex justify-content-start flex-column">
                          <span className="text-muted fw-semibold text-muted d-block fs-7">
                            {moment(transaction.date).format("YYYY-MMM-D h:mm")}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex flex-column w-100 me-2">
                        <div className="d-flex flex-stack mb-2">
                          <span className="text-muted me-2 fs-7 fw-semibold">
                            {transaction.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-flex flex-column w-100 me-2">
                        <div className="d-flex flex-stack mb-2">
                          <span className="text-muted me-2 fs-7 fw-semibold">
                            {transaction.mode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-flex flex-column w-100 me-2">
                        <div className="d-flex flex-stack mb-2">
                          <span className="text-muted me-2 fs-7 fw-semibold">
                            {transaction.unitValue} Units
                          </span>
                        </div>
                      </div>
                    </td>
                    {currentUser?.type === "admin" && (
                      <td>
                        <div className="d-flex justify-content-end flex-shrink-0">
                          <a
                            href="#"
                            className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                            onClick={() => {
                              setConfirmation({
                                message:
                                  "Are you sure you want to delete this transaction?",
                                action: () => {
                                  deleteTransaction(transaction);
                                },
                                close: () => {
                                  setConfirmation(null);
                                },
                              });
                            }}
                          >
                            <KTIcon iconName="trash" className="fs-3" />
                          </a>
                          <a
                            href="#"
                            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                            onClick={() => {
                              setTransaction(transaction);
                              setTransactionOpen(true);
                            }}
                          >
                            <KTIcon iconName="pencil" className="fs-3" />
                          </a>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            {/* end::Table body */}
          </table>
          {meta && (
            <CustomPagination meta={meta} navigatePage={getTransactions} />
          )}
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  );
};

export { TablesWidget9 };

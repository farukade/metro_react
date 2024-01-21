import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { KTIcon, formatCurrency } from "../../../helpers";
import { TransactionModel, useAuth } from "../../../../app/modules/auth";
import {
  removeTransaction,
  fetchTransaction,
} from "../../../../app/modules/auth/core/_requests";
import moment from "moment";

type Props = {
  className: string;
  transactions: TransactionModel[];
  setTransactions: Dispatch<SetStateAction<TransactionModel[]>>;
  setTransactionOpen: Dispatch<SetStateAction<boolean>>;
};

const TablesWidget9: React.FC<Props> = ({
  className,
  setTransactionOpen,
  transactions,
  setTransactions,
}) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const getTransactions = useCallback(async () => {
    try {
      document.body.classList.add("page-loading");

      const { data: rs } = await fetchTransaction(currentUser, { page, limit });
      if (rs?.success) {
        document.body.classList.remove("page-loading");
        const { result, ...rest } = rs.data;
        setTransactions(result);
        if (currentUser) {
          setCurrentUser({ ...currentUser, ...rest });
        }
      } else {
        document.body.classList.remove("page-loading");
      }
    } catch (error: any) {
      document.body.classList.remove("page-loading");
      console.log(error);
    }
  }, [page]);

  const deleteTransaction = async (item: TransactionModel) => {
    try {
      document.body.classList.add("page-loading");

      if (!item.id) {
        return;
      }
      const { data: rs } = await removeTransaction(currentUser, item.id);
      if (rs?.success) {
        document.body.classList.remove("page-loading");
        let newData: any = [];
        for (const transaction of transactions) {
          if (transaction.id !== item.id) {
            newData = [...newData, transaction];
          }
        }
        setTransactions(newData);
      } else {
        document.body.classList.remove("page-loading");
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
                            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                            onClick={() => {
                              deleteTransaction(transaction);
                            }}
                          >
                            <KTIcon iconName="trash" className="fs-3" />
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
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  );
};

export { TablesWidget9 };

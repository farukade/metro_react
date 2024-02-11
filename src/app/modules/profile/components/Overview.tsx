import { useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { TransactionForm } from "../../../../_metronic/partials/modals/transaction/TransactionForm";
import { TablesWidget9 } from "../../../../_metronic/partials/widgets";
import { TransactionModel } from "../../auth/core/_models";
import ConfirmationModal from "../../../../_metronic/partials/modals/confirmation/Confirmation";
import { ConfirmationType } from "../../../../_metronic/layout/core";

export function Overview() {
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [transaction, setTransaction] = useState<TransactionModel | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationType | null>(
    null
  );

  return (
    <Content>
      <div className="row g-5 g-xxl-8">
        <div className="col-xl-12">
          <TablesWidget9
            meta={meta}
            setMeta={setMeta}
            className="mb-5 mb-xl-8"
            transactions={transactions}
            setTransactions={setTransactions}
            setTransaction={setTransaction}
            setTransactionOpen={setTransactionOpen}
            setConfirmation={setConfirmation}
          />
        </div>
      </div>
      {transactionOpen && (
        <TransactionForm
          meta={meta}
          setMeta={setMeta}
          setTransactionOpen={setTransactionOpen}
          setTransactions={setTransactions}
          setTransaction={setTransaction}
          transactions={transactions}
          transaction={transaction}
          transactionOpen={transactionOpen}
        />
      )}
      {confirmation && (
        <ConfirmationModal
          message={confirmation.message}
          action={confirmation.action}
          close={confirmation.close}
        />
      )}
    </Content>
  );
}

import { useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { TransactionForm } from "../../../../_metronic/partials/modals/transaction/TransactionForm";
import { TablesWidget9 } from "../../../../_metronic/partials/widgets";
import { TransactionModel } from "../../auth/core/_models";

export function Overview() {
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [transaction, setTransaction] = useState<TransactionModel | null>(null);

  return (
    <Content>
      <div className="row g-5 g-xxl-8">
        <div className="col-xl-12">
          <TablesWidget9
            className="mb-5 mb-xl-8"
            transactions={transactions}
            setTransactions={setTransactions}
            setTransaction={setTransaction}
            setTransactionOpen={setTransactionOpen}
          />
        </div>
      </div>
      {transactionOpen && (
        <TransactionForm
          setTransactionOpen={setTransactionOpen}
          setTransactions={setTransactions}
          setTransaction={setTransaction}
          transactions={transactions}
          transaction={transaction}
          transactionOpen={transactionOpen}
        />
      )}
    </Content>
  );
}

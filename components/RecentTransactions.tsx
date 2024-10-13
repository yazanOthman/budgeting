import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page,
}: RecentTransactionsProps) => {
  const rowPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowPerPage);

  const indexOfLastTransaction = page * rowPerPage;
  const indeOfFirstTransaction = indexOfLastTransaction - rowPerPage;

  const currentTransactions = transactions.slice(
    indeOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent Transactions</h2>
        <Link
          className="view-all-btn"
          href={`/transaction-history/?id=${appwriteItemId}`}
        >
          View All
        </Link>
      </header>
      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account?.id} value={account?.appwriteItemId}>
              <BankTabItem
                key={account?.id}
                account={account}
                appwriteItemId={appwriteItemId}
              />
            </TabsTrigger>
          ))}
        </TabsList>
        {accounts.map((account: Account) => (
          <TabsContent
            className="space-y-4"
            key={account.id}
            value={account?.appwriteItemId}
          >
            <BankInfo
              account={account}
              appwriteItemId={account?.appwriteItemId}
              type="full"
            />
            <TransactionsTable transactions={currentTransactions} />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination page={page} totalPages={totalPages} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;

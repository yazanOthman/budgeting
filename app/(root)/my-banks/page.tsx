import BankCard from "@/components/ui/BankCard";
import Headerbox from "@/components/ui/Headerbox";
import { getAccounts } from "@/lib/actions/bank.action";
import { getLoggedInUser } from "@/lib/actions/user.action";
import React from "react";

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;
  return (
    <section className="flex">
      <div className="my-banks">
        <Headerbox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities"
        />
        <div className="space-y-5">
          <div className="header-2">Your cards</div>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((account: Account) => {
                return (
                  <BankCard
                    key={account.id}
                    account={account}
                    userName={loggedIn?.firstName}
                    showBalance
                  />
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanks;

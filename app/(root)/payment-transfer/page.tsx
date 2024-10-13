import PaymentTransferForm from "@/components/PaymentTransferForm";
import Headerbox from "@/components/ui/Headerbox";
import { getAccounts } from "@/lib/actions/bank.action";
import { getLoggedInUser } from "@/lib/actions/user.action";
import React from "react";

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountData = accounts?.data;

  return (
    <section className="payment-transfer">
      <Headerbox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />
      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountData} />
      </section>
    </section>
  );
};

export default Transfer;

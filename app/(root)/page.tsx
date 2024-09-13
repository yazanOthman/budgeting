import React from "react";
import Headerbox from "@/components/ui/Headerbox";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import RightSidebar from "@/components/ui/RightSidebar";
import { getLoggedInUser } from "@/lib/actions/user.action";

const Home = async () => {
  const loggedIn = await getLoggedInUser();
  console.log(loggedIn);
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <Headerbox
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || "Guest"}
            subtext="Access and manage your acount and transaction efficently"
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={2000}
          />
        </header>
        RECENT transaction
      </div>
      {loggedIn && (
        <RightSidebar
          user={loggedIn}
          transactions={[]}
          banks={[{ currentBalance: 1200 }, { currentBalance: 500 }]}
        />
      )}
    </section>
  );
};

export default Home;

import React from "react";
import Headerbox from "@/components/ui/Headerbox";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import RightSidebar from "@/components/ui/RightSidebar";

const Home = () => {
  const loggedIn = {
    firstName: "Yazan",
    lastName: "Othman",
    email: "yazan@gmail.com",
  };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <Headerbox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
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
      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 1200 }, { currentBalance: 500 }]}
      />
    </section>
  );
};

export default Home;

import { logoutAccount } from "@/lib/actions/user.action";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const logout = await logoutAccount();
      if (logout) {
        router.push("/sign-in");
      }
    } catch (error) {}
  };
  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">{user?.firstName}</p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer-email"}
      >
        <h1 className="text-14 truncate font-semibold text-gray-600">
          {user?.firstName}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {user?.email}
        </p>
      </div>
      <div className="footer_image">
        <Image src="/icons/logout.svg" fill alt="jsm" onClick={handleLogout} />
      </div>
    </footer>
  );
};

export default Footer;

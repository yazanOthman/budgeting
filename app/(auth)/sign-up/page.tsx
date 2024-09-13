import React from "react";
import AuthForm from "@/components/ui/AuthForm";
import { getLoggedInUser } from "@/lib/actions/user.action";

const Signup = async () => {
  const userLoggedIn = await getLoggedInUser();

  console.log(userLoggedIn);

  return (
    <section className="flex-center size-full mx-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default Signup;

import AuthForm from "@/components/ui/AuthForm";
import React from "react";

const Signin = () => {
  return (
    <section className="flex-center size-full mx-sm:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
};

export default Signin;

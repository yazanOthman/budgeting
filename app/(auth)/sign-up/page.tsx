import React from "react";
import AuthForm from "@/components/ui/AuthForm";

const Signup = async () => {
  return (
    <section className="flex-center size-full mx-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default Signup;

import React from "react";
import {
  createUserIfMissing,
  getCurrentUser,
  signInWithEmail,
} from "../../supabase/supabase";

export const SignInWithDemo = () => {
  const signInWithDemoAccount = async () => {
    try {
      const { error } = await signInWithEmail(
        "testwithemail@mail.com",
        "mypassword"
      );
      if (error) throw error;

      const user = await getCurrentUser();
      if (user) {
        await createUserIfMissing(user);
      }
    } catch (error) {
      console.error("error while signing in with demo account:", error);
    }
  };

  return (
    <p
      className="sans-serif z-50 mx-3 font-bold uppercase tracking-widest text-sh-grey md:mx-0 md:ml-4 md:text-xs md:hover:cursor-pointer md:hover:text-p-white"
      onClick={signInWithDemoAccount}
    >
      DEMO
    </p>
  );
};

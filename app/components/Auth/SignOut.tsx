import React from "react";
import { signOut } from "../../supabase/supabase";
import { usePathname, useRouter } from "next/navigation";

export const SignOut = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onSignOut = async () => {
    await signOut();

    // go back home, traveler
    if (pathname?.includes("profile")) {
      router.push("/");
    }
  };

  return (
    <p
      className="hover:text-white block cursor-pointer px-4 pt-2 md:p-0"
      onClick={onSignOut}
    >
      Sign Out
    </p>
  );
};

"use client";

import { useEffect, useState } from "react";
import { createUserIfMissing, onAuthStateChanged } from "app/supabase/supabase";
import Navbar from "./Navbar";

export const LayoutNavbar = ({ newUserName }: { newUserName?: string }) => {
  const [user, setUser] = useState<any>();

  //this handles the login/logout styles and displays in the navbar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTransparentNav, setIsTransparentNav] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        createUserIfMissing(user).catch((err) => {
          console.error("Error creating Supabase user profile:", err);
        });
      } else {
        setIsLoggedIn(false);
        setIsTransparentNav(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {}, [newUserName]);
  return (
    <Navbar
      userName={newUserName || user?.displayName}
      profilePic={user?.photoURL}
      currentUserId={user?.uid}
      isLoggedIn={isLoggedIn}
      isTransparentNav={isTransparentNav}
    />
  );
};

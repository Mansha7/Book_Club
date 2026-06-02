"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "./supabase/supabase";
import { Home } from "./components/Home/Home";
import { HomeSignedOut } from "./components/Home/HomeSignedOut";
import { LayoutNavbar } from "./components/Navigation/LayoutNavbar";
import { Footer } from "./components/Navigation/Footer";

export default function Page() {
  const [user, setUser] = useState<any>();
  const [books, setBooks] = useState<any>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchPopularBooks = async () => {
    const res = await fetch(
      // `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY} `
      `https://openlibrary.org/subjects/fiction.json?limit=6&offset=1`
    );

    if (!res.ok) {
      console.error("error fetching popular books");
      return;
    }

    const data = await res.json();

    setBooks(data.works);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    fetchPopularBooks();

    return unsubscribe;
  }, []);
  return (
    <>
      <LayoutNavbar />
      {isLoggedIn && <Home books={books} user={user} />}

      {!isLoggedIn && <HomeSignedOut books={books} />}

      <Footer />
    </>
  );
}

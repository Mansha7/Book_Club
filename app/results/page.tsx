"use client";

import { LayoutNavbar } from "app/components/Navigation/LayoutNavbar";
import React, { use, useEffect, useState } from "react";
import { FilterResults } from "app/components/Filter/FilterResults";
import { Footer } from "app/components/Navigation/Footer";

export default function Page({ searchParams }: { searchParams: any }) {
  const query = use(searchParams);

  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<any[] | null>();

  const fetchBooksBySearchTerm = async () => {
    setIsLoading(true);

    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&limit=20`
    );

    if (!res.ok) {
      console.error("error fetching books with your search term");
      setIsLoading(false);
      return;
    }

    const data = await res.json();

    const validBookResults = data.docs
      .filter((book: any) => !!book.cover_i)
      .map((book: any) => ({
        ...book,
        cover_id: book.cover_i,
      }));

    setBooks(validBookResults);

    setIsLoading(false);
  };

  useEffect(() => {
    //@ts-ignore
    if (query.searchTerm) {
      //@ts-ignore
      setSearchTerm(query.searchTerm);
    } else {
      console.error("query is invalid");
    }
  }, [query]);

  useEffect(() => {
    if (searchTerm) {
      fetchBooksBySearchTerm();
    }
  }, [searchTerm]);

  return (
    <>
      <LayoutNavbar />
      <div className="site-body min-h-[80vh] py-5">
        <div className="px-4 font-['Graphik'] md:mx-auto md:my-0 md:flex md:w-[950px] md:flex-col">
          {isLoading && <p className="text-base text-sh-grey">Loading..</p>}

          {books && <FilterResults books={books} />}
        </div>

        <Footer />
      </div>
    </>
  );
}

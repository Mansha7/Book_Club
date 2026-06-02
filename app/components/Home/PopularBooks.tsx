"use client";

import React from "react";
import { PopularMoviePoster } from "./PopularMoviePoster";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const PopularBooks = ({ books }: { books: any }) => {
  const path = usePathname();

  return (
    <>
      <div className="section-heading border-b-grey text-sh-grey mb-3 flex justify-between border-b border-solid text-xs">
        <p className="hover:text-hov-blue text-sm hover:cursor-pointer">
          POPULAR ON CLONNERBOXD
        </p>{" "}
        {!path.includes("films") && (
          <Link
            href={"/films"}
            className="hover:text-hov-blue text-[11px] hover:cursor-pointer"
          >
            MORE
          </Link>
        )}
      </div>

      <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {!books &&
          "No populars available at the moment. Please try again later."}

        {Array.isArray(books) &&
          books
            .filter((book) => !!book.cover_id)
            .slice(0, 6)
            .map((book) => (
              <PopularMoviePoster
                key={book.cover_id}
                book={book}
              />
            ))}
      </div>
    </>
  );
};

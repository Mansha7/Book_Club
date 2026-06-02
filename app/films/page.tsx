"use client";
import { LayoutNavbar } from "app/components/Navigation/LayoutNavbar";
import React, { useEffect, useState } from "react";

import filterOptions from "./filtering/arrays";
import { Filter } from "app/components/Filter/Filter";
import { PopularBooks } from "app/components/Home/PopularBooks";
import { useRouter } from "next/navigation";
import { Footer } from "app/components/Navigation/Footer";

import { useSearchParams } from "next/navigation";

const getSubjectFromGenre = (genre?: string) => {
  if (!genre) return "fiction";
  return genre.toLowerCase().replace(/\s+/g, "_");
};

const getBooksUrl = (subject: string, limit = 24) =>
  `https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json?limit=${limit}&offset=1`;

const getFilteredBooks = (books: any[], activeFilters: { [key: string]: string }) => {
  let filteredBooks = books.filter((book) => !!book.cover_id);

  if (activeFilters.years) {
    const startYear = parseInt(activeFilters.years.slice(0, -1));
    const endYear = startYear + 9;

    filteredBooks = filteredBooks.filter((book) => {
      const publishYear = Number(book.first_publish_year);
      return publishYear >= startYear && publishYear <= endYear;
    });
  }

  if (activeFilters.ratings === "Highest First") {
    filteredBooks = [...filteredBooks].sort((a, b) => (b.edition_count ?? 0) - (a.edition_count ?? 0));
  } else if (activeFilters.ratings === "Lowest First") {
    filteredBooks = [...filteredBooks].sort((a, b) => (a.edition_count ?? 0) - (b.edition_count ?? 0));
  }

  return filteredBooks;
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});

  const [isLoading, setIsLoading] = useState(true);
  const [filterResults, setFilterResults] = useState<any[] | null>(null);
  const [popularBooks, setPopularBooks] = useState<any[] | null>(null);

  useEffect(() => {
    const initialFilters: { [key: string]: string } = {};
    for (const [key, value] of searchParams.entries()) {
      initialFilters[key] = value;
    }
    setActiveFilters(initialFilters);
  }, [searchParams]);

  const onSelect = (value: string, title: string) => {
    let updated = { ...activeFilters };

    if (updated[title] === value) {
      delete updated[title];
    } else {
      updated[title] = value;
    }

    const queryString = new URLSearchParams(updated).toString();
    const newUrl = queryString ? `/films?${queryString}` : "/films";
    router.push(newUrl);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (Object.keys(activeFilters).length === 0) {
        const res = await fetch(getBooksUrl("fiction", 24));
        const data = await res.json();
        setPopularBooks(data.works);
        setFilterResults(null);
        setIsLoading(false);
        return;
      }

      const subject = getSubjectFromGenre(activeFilters.genres);
      const url = getBooksUrl(subject, 100);

      try {
        const res = await fetch(url);
        const data = await res.json();
        const books = getFilteredBooks(data.works ?? [], activeFilters);
        setFilterResults(books);
        setPopularBooks(null);
      } catch (error) {
        console.error("Error fetching books:", error);
        setFilterResults([]);
        setPopularBooks(null);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [activeFilters]);

  return (
    <>
      <LayoutNavbar />
      <div className="site-body min-h-[80vh] py-5">
        <div className="px-4 font-['Graphik'] md:mx-auto md:my-0 md:flex md:w-[950px] md:flex-col">
          <div className="md:flex md:flex-row">
            <p className="sans-serif block self-center px-4 text-xs uppercase tracking-normal text-sh-grey md:px-0">
              Browse by:
            </p>
            <div className="grid grid-cols-2 md:flex md:flex-row">
              {filterOptions.map((option) => (
                <Filter
                  key={option.title}
                  title={option.title}
                  values={option.values}
                  currentValues={activeFilters[option.title] ? [activeFilters[option.title]] : []}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>

          <div className="mb-10 flex items-start justify-between gap-2">
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex flex-col gap-2 text-sh-grey">
                <p className="text-gray-600">Active filters</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(activeFilters).map(([key, value]) => (
                    <span key={key} className="bg-blue-100 text-blue-800 inline-flex items-center rounded-full">
                      {key.substring(0, 1).toUpperCase() + key.substring(1)} : {value}
                      <button onClick={() => onSelect(value, key)} className="text-blue-600 hover:text-blue-800 ml-2">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(activeFilters).length > 0 && (
              <div>
                <button
                  onClick={() => router.push("/films")}
                  className="hover:text-blue-800 text-sh-grey hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {isLoading && <p className="text-base text-sh-grey">Loading..</p>}
          {!isLoading && popularBooks && <PopularBooks books={popularBooks} />}
          {!isLoading && filterResults && <PopularBooks books={filterResults} />}
        </div>
      </div>
      <Footer />
    </>
  );
}

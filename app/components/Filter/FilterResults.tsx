import Link from "next/link";
import { PopularMoviePoster } from "../Home/PopularMoviePoster";

export const FilterResults = ({ books }: { books: any[] }) => {
  return (
    <div className="w-full font-['Graphik'] md:mx-auto md:my-0 md:flex md:flex-row">
      <div className="flex w-full flex-col">
        <div className="section-heading mb-3 flex justify-between border-b border-solid border-b-grey text-xs text-sh-grey">
          <div className="text-base">Book results</div>
        </div>

        <div>
          {books.length === 0 && <p className="text-base text-sh-grey">No results found, please try again.</p>}
          {books.map((book) => (
            <div
              key={book.key ?? book.cover_id}
              className="my-2 flex flex-col gap-4 border-b border-solid border-b-grey pb-2 md:flex-row"
            >
              <div className="min-w-[150px] max-w-[150px]">
                <PopularMoviePoster book={book} compact={false} />
              </div>
              <div className="flex flex-col">
                <Link href={book.key ? `https://openlibrary.org${book.key}` : "/"} className="text-xl font-bold text-p-white">
                  {book.title}
                </Link>
                <div className="flex flex-col gap-2 text-sh-grey">
                  {book.author_name?.length > 0 && <p className="text-sm">By {book.author_name.join(", ")}</p>}
                  {book.first_publish_year && <p className="text-sm">First published: {book.first_publish_year}</p>}
                  {book.edition_count && <p className="text-sm">Editions: {book.edition_count}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

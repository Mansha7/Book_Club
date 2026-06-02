import React, { useEffect, useState } from "react";

import Image from "next/image";
import FavouriteButton from "../Buttons/FavoriteButton";
import { WatchButton } from "../Buttons/WatchButton";
import Link from "next/link";
import { auth, getUserById } from "app/supabase/supabase";

export const PopularMoviePoster = ({
  book,
  compact = false,
}: {
  book: any;
  compact?: boolean;
}) => {
  const itemId = book?.cover_id;
  const title = book?.title ?? "Untitled";
  const posterSrc = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
  const href = book?.key ? `https://openlibrary.org${book.key}` : "/";
  const itemIdString = itemId?.toString() ?? "";

  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // @to-do create hook
  const [isFavourite, setIsFavourite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const setIsMovieFavourite = async () => {
    if (!auth || !auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const user = await getUserById(userId);

    const userFavs = user?.favourites ?? [];
    const isFavorite = userFavs.some(
      (books) => books?.movieID?.toString() === itemId?.toString()
    );
    setIsFavourite(isFavorite);
  };

  const setIsMovieWatched = async () => {
    if (!auth || !auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const user = await getUserById(userId);

    const userWatched = user?.watched ?? [];
    const isWatched = userWatched.some(
      (books) => books?.movieID?.toString() === itemId?.toString()
    );
    setIsWatched(isWatched);
  };

  const setInitialMovieStatuses = () => {
    setIsMovieFavourite();
    setIsMovieWatched();
  };

  useEffect(() => {
    if (auth && auth.currentUser) {
      setInitialMovieStatuses();
    }
  }, [itemId, auth.currentUser]);

  useEffect(() => {
    const handleResize = () => {
      setIsHovered(window.innerWidth <= 768);
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!itemIdString || !posterSrc) return null;

  return (
    <div
      className={
        (compact ? "w-[32.33%] " : "") +
        `hover:border-3 relative aspect-[2/3] basis-1/6 rounded border border-solid border-pb-grey/25 shadow-[0_0_1px_1px_rgba(20,24,28,1)] hover:cursor-pointer hover:rounded hover:border-pb-grey`
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isMobile) {
          setIsHovered(false);
        }
      }}
    >
      <Link href={href}>
        <div className="relative h-full w-full">
          <Image
            src={posterSrc}
            fill
            alt={title}
            className="rounded border object-cover"
          />
        </div>
      </Link>

      {isHovered && (
        <div
          className="absolute left-[30%] top-[80%] z-10 flex items-center rounded p-0.5 md:left-[25%] md:top-[75%]"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <FavouriteButton
            id={itemIdString}
            title={title}
            isFavourite={isFavourite}
            setIsFavourite={setIsFavourite}
          />
          <WatchButton
            id={itemIdString}
            title={title}
            isWatched={isWatched}
            setIsWatched={setIsWatched}
          />
        </div>
      )}
    </div>
  );
};

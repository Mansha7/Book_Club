"use client";
import React, { useEffect, useState } from "react";

import {
  addToMovieReviews,
  addToUserArray,
  auth,
  getMovieById,
  removeFromMovieReviews,
  removeFromUserArray,
  getCurrentUser,
} from "../../supabase/supabase";
import { createReviewPopup, PopupAction } from "../../utils";
import { MovieReviewCompact } from "../Review/MovieReviewCompact";
import moment from "moment";
import { Review } from "app/types";

export const MovieReviews = ({ movie }) => {
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const submitReview = async (e: any, review: string) => {
    e.preventDefault();

    if (!review || !auth.currentUser) {
      createReviewPopup(PopupAction.ERROR);
      return;
    }

    try {
      await saveUserReview();
      await saveMovieReview();
    } catch (err) {
      console.error("Error saving review:", err);
    } finally {
      fetchReviewsByMovie(); // Refetch reviews
      setReview(""); // Cleanup input
    }
  };

  /**
   * Saves the review for the user which has posted it
   */
  const saveUserReview = async () => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;

    await addToUserArray(userId, "reviews", {
      movieID: movie.id,
      review: review,
      timestamp: getDate(),
    });
  };

  /**
   * Checks if a movie is already stored in DB and saves the review or movie + review
   */
  const saveMovieReview = async () => {
    try {
      const movieDoc = await getMovieById(movie.id);

      if (movieDoc) {
        // Add review to existing movie
        await addMovieReview();
      } else {
        // Create a new movie document with the review
        await addNewMovieDocWithReview();
      }
    } catch (err) {
      console.error("Error saving movie review:", err);
    }
  };

  /**
   * Adds a review on the movie which already exists in the db
   */
  const addMovieReview = async () => {
    if (!auth.currentUser) return;

    try {
      await addToMovieReviews(movie.id, {
        movieID: movie.id,
        userName: auth.currentUser.displayName,
        userURL: auth.currentUser.photoURL,
        review: review,
        uid: auth.currentUser.uid,
        timestamp: getDate(),
      });

      createReviewPopup(PopupAction.SUCCESS);
    } catch (err) {
      console.error("Error updating movie review:", err);
    }
  };

  const addNewMovieDocWithReview = async () => {
    if (!auth.currentUser) return;

    try {
      await addToMovieReviews(movie.id, {
        movieID: movie.id,
        review: review,
        userName: auth.currentUser.displayName,
        userURL: auth.currentUser.photoURL,
        uid: auth.currentUser.uid,
        timestamp: getDate(),
      });
    } catch (err) {
      console.error("Error creating new movie document with review:", err);
    }
  };

  const fetchReviewsByMovie = async () => {
    const movieDoc = await getMovieById(movie.id);
    if (!movieDoc) {
      setReviews([]);
      return;
    }
    const movieReviews = movieDoc.reviews;
    if (!movieReviews) {
      setReviews([]);
      return;
    }

    setReviews(movieReviews);
  };

  const handleDelete = async (review) => {
    // On the user document, we only store minimal info, and we need a ref. to that to delete as well
    const userProfileReview = {
      movieID: review.movieID,
      review: review.review,
      timestamp: review.timestamp,
    };

    await removeFromMovieReviews(
      review.movieID,
      (movieReview) =>
        movieReview.uid === review.uid &&
        movieReview.review === review.review &&
        movieReview.timestamp === review.timestamp
    )
      .then(() => {
        createReviewPopup(PopupAction.REMOVED);
        fetchReviewsByMovie();
      })
      .catch((err) => {
        console.error(err);
        createReviewPopup(PopupAction.ERROR);
      });

    await removeFromUserArray(
      review.uid,
      "reviews",
      (value) =>
        value.movieID?.toString() === userProfileReview.movieID.toString() &&
        value.review === userProfileReview.review &&
        value.timestamp === userProfileReview.timestamp
    ).catch((err) => {
      console.error(err);
    });
  };

  const getDate = () => {
    return moment().format("DD.MM.YYYY");
  };
  useEffect(() => {
    fetchReviewsByMovie();
    getCurrentUser().then(setCurrentUser);
  }, []);

  return (
    <div className="mt-3 flex w-full flex-col justify-between gap-2 md:ml-[6.5rem] md:w-[50%]">
      {reviews.length > 0
        ? reviews.map((r, i) => (
            <MovieReviewCompact
              key={i}
              review={r}
              handleDelete={handleDelete}
            />
          ))
        : ""}

      {!reviews.length && currentUser && (
        <p className="pt-2 text-base text-sh-grey">Write the first review!</p>
      )}

      {!review.length && !currentUser && (
        <p className="pt-2 text-base text-sh-grey">
          Login and write the first review!
        </p>
      )}

      {/* REVIEW FORM */}
      {currentUser && (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => submitReview(e, review)}
        >
          <textarea
            className="active-outline-none rounded bg-h-grey p-3 text-drop-black focus:outline-none"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            type="submit"
            className="rounded bg-c-grey p-1 text-base text-l-white hover:bg-sh-grey hover:text-b-blue"
          >
            Send Review
          </button>
        </form>
      )}
    </div>
  );
};

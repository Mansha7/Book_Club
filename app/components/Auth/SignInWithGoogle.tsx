import React from "react";
import {
  createUserIfMissing,
  getCurrentUser,
  signInWithGoogle as signInWithSupabaseGoogle,
} from "../../supabase/supabase";

// When i sign in, check if user exists
// If not, create db references and docs and collection for it like this:
// users / displayName (name, bio, reviews, watched) /favourites (movieid, isfav) / reviews (movieid, review) /watched(movieid, iswatched)/watchlist

export const SignInWithGoogle = () => {
  const signInWithGoogle = async () => {
    const { error } = await signInWithSupabaseGoogle();
    if (error) {
      console.error("error while signing in with google account: ", error);
      return;
    }

    const user = await getCurrentUser();
    if (user) {
      await createUserIfMissing(user);
    }
  };

  return (
    <p
      className="sans-serif z-50 mx-3 font-bold uppercase tracking-widest text-sh-grey md:mx-0 md:ml-4 md:text-xs md:hover:cursor-pointer md:hover:text-p-white"
      onClick={signInWithGoogle}
    >
      Google
    </p>
  );
};

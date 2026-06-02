import { createClient, User as SupabaseUser } from "@supabase/supabase-js";

export type CurrentUser = {
  uid: string;
  email?: string;
  displayName: string;
  photoURL: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser: CurrentUser | null = null;

const toCurrentUser = (user: SupabaseUser | null): CurrentUser | null => {
  if (!user) return null;

  return {
    uid: user.id,
    email: user.email,
    displayName:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      "Anonymous",
    photoURL:
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      "/default-avatar.png",
  };
};

export const auth = {
  get currentUser() {
    return currentUser;
  },
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  currentUser = toCurrentUser(user);
  return currentUser;
};

export const onAuthStateChanged = (
  callback: (user: CurrentUser | null) => void
) => {
  getCurrentUser().then(callback);

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = toCurrentUser(session?.user ?? null);
    callback(currentUser);
  });

  return () => subscription.unsubscribe();
};

export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        typeof window !== "undefined" ? window.location.origin : undefined,
    },
  });
};

export const signInWithEmail = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  currentUser = null;
  return supabase.auth.signOut();
};

export const updateCurrentUserProfile = async (name: string) => {
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: name, name },
  });

  if (error) throw error;

  currentUser = toCurrentUser(data.user);
  return currentUser;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;
  return data ?? [];
};

export const createUserIfMissing = async (user: CurrentUser) => {
  const existingUser = await getUserById(user.uid);
  if (existingUser) return existingUser;

  const { data, error } = await supabase
    .from("users")
    .insert({
      id: user.uid,
      uid: user.uid,
      name: user.displayName,
      bio: "My movie watching journey, on clonnerboxd :)",
      photoUrl: user.photoURL,
      reviews: [],
      watched: [],
      favourites: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserById = async (
  id: string,
  values: Record<string, any>
) => {
  const { error } = await supabase.from("users").update(values).eq("id", id);

  if (error) throw error;
};

export const getMovieById = async (id: string | number) => {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id.toString())
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getAllMovies = async () => {
  const { data, error } = await supabase.from("movies").select("*");

  if (error) throw error;
  return data ?? [];
};

export const upsertMovieById = async (
  id: string | number,
  values: Record<string, any>
) => {
  const { error } = await supabase.from("movies").upsert({
    id: id.toString(),
    ...values,
  });

  if (error) throw error;
};

export const addToUserArray = async (
  userId: string,
  key: "reviews" | "watched" | "favourites",
  value: any
) => {
  const user = await getUserById(userId);
  const currentValues = Array.isArray(user?.[key]) ? user[key] : [];

  await updateUserById(userId, {
    [key]: [...currentValues, value],
  });
};

export const removeFromUserArray = async (
  userId: string,
  key: "reviews" | "watched" | "favourites",
  predicate: (value: any) => boolean
) => {
  const user = await getUserById(userId);
  const currentValues = Array.isArray(user?.[key]) ? user[key] : [];

  await updateUserById(userId, {
    [key]: currentValues.filter((value) => !predicate(value)),
  });
};

export const addToMovieReviews = async (
  movieId: string | number,
  review: any
) => {
  const movie = await getMovieById(movieId);
  const reviews = Array.isArray(movie?.reviews) ? movie.reviews : [];

  await upsertMovieById(movieId, {
    reviews: [...reviews, review],
  });
};

export const removeFromMovieReviews = async (
  movieId: string | number,
  predicate: (value: any) => boolean
) => {
  const movie = await getMovieById(movieId);
  const reviews = Array.isArray(movie?.reviews) ? movie.reviews : [];

  await upsertMovieById(movieId, {
    reviews: reviews.filter((value) => !predicate(value)),
  });
};

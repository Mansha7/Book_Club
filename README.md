# ClonnerboxD - Letterboxd Clone

## Project's Scope

- Fully responsive clone of a popular social movie tracking and reviewing platform
- Search, save and review your favourite movies, fetched from The Movie Database ’s API
- Implement Google Auth using Supabase Auth and store users' information in Supabase tables
- Live preview on [Vercel's Hosting](https://clonnerboxd.vercel.app/).

## Live Demo

### On Browser

![Gif preview of the Clonnerboxd](./assets/clonnerboxd-preview-desktop.gif)

### On Mobile

![Gif preview of the Clonnerboxd on mobile](./assets/clonnerboxd-mobile-preview.gif)

## Getting Started

### Installing and running

```
git clone https://github.com/janaiscoding/letterboxd-clone.git
cd letterboxd-clone
npm install
```

### Prerequisites for running your own version

Get an API key from [TMDB](https://developer.themoviedb.org/reference/intro/getting-started)

Create a new project from [Supabase](https://supabase.com/) and connect it

Create a `.env` file at the root of the repository with the following values for Supabase and TMDB:

```
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
NEXT_PUBLIC_TMDB_API_KEY="your-tmdb-api-key"
```

```
npm run dev
```

## Project Details & Description

- On **Homepage** you can see the current popular movies, fetched from [The Movie Database](https://www.themoviedb.org/).
- On **Profile** you can see what movies you liked and watched, as well as your most recent reviews.
- On **Films** page you can filter by different browsing categories: years, ratings and genres!
- On **Members** you can see all the currently registered users and their info. You can see their profiles as well.
- On **Reviews** you can see all the reviews on the platform.
- On **Settings** you can edit your display name and your bio (which will update your profile).
- In the navbar you can **search** for any movie to add to your collection.

# Built with

## Technologies

- ReactJs, Javascript, TypeScript, Next.js
- CSS3, TailwindCSS
- HTML5

## Tools Used

- Visual Studio Code
- npm package manager
- Linux Terminal
- Git and Github

## Sources, Materials, Copyright

- This is a [Letterboxd](https://letterboxd.com/) website replica
- API used: [The Movie Database](https://www.themoviedb.org/)

# Book Club - platform for literay geeks

## Project's Scope

- Fully responsive platform for finding and publishing literature content with an AI integrated text editor
- Search, save and review your favourite books, fetched from OpenLibrary’s API
- Implement Google Auth using Supabase Auth and store users' information in Supabase tables

## Getting Started

### Installing and running

```
git clone https://github.com/Mansha7/Book_Club.git
cd Book_Club
npm install
```

### Prerequisites for running your own version

Get an API key from GROQ for model integration (https://console.groq.com/home)

Create a new project from [Supabase](https://supabase.com/) and connect it

Create a `.env` file at the root of the repository with the following values for Supabase and preferred AI model:

```
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
GROQ_API_KEY="your-groq-api-key"
```

```
npm run dev
```

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

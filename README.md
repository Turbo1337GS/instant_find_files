This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


# IFF - Intelligent File Finder

## Introduction

IFF is a web application that allows users to search for files on the internet. It uses a combination of Bing search and web scraping to find links to files that can be downloaded.

## Features

* Search for files by name, extension, or size.
* Sort results by name, size, or date.
* Filter results by file extension.
* Download files with a single click.

## How to use

To use IFF, simply enter a search term into the search bar and click the "Find" button. The results will be displayed in a list below the search bar. You can sort and filter the results using the options at the top of the list. To download a file, simply click on the "Download" button next to the file name.

## Code Walkthrough

The code for IFF is divided into three main files:

* `app/page.tsx`: This file contains the React code for the user interface.
* `next.config.js`: This file contains the Next.js configuration for the application.
* `pages/api/server.py`: This file contains the Python code for the server that handles the search requests.

### `app/page.tsx`

The `app/page.tsx` file contains the React code for the user interface. This file is responsible for rendering the search bar, the results list, and the sort and filter options.

The following code snippet shows the React code for the search bar:

```jsx
const [searchTerm, setSearchTerm] = useState<string>("");

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(event.target.value);
};

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-100">
    <div className="sticky top-0 z-10 flex flex-col items-center bg-gray-800 p-4 rounded shadow-lg space-y-2">
      {/* Logo and Search Input */}
      <div className="w-full flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <img src="https://main.gigasoft.com.pl/logo.png" alt="Logo


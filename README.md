# TestackAI - Knowledge Base Manager

Live demo: [https://knowledge-base-manager.vercel.app/](https://knowledge-base-manager.vercel.app/)

## How to run

Once you have cloned the repository, in the root directory, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also run a production-like version locally this way:

```bash
npm run build
npm run start
```

> Troubleshooting: If some of these commands don't work, try the following:
> - Verify you have Node.js installed and are using a relatively new version (18 or higher)
> - Delete the `/.next` directory in the root directory of the project

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/) (v19)
- [Next.js](https://nextjs.org/docs) (v15)
- [Tailwind CSS](https://tailwindcss.com/) (v4)
- [SWR](https://swr.vercel.app/) (v2)
- [Shadcn](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## Quick description

A file management application built with React and Next.js that allows users to browse, index, and manage files for creating knowledge bases. This application provides a familiar file system interface with the ability to read, select, index, and delete files from a connected Google Drive, similar to the functionality of native file explorers like Finder on macOS.

## Pages

- `/login` - Login page
- `/` - Home page, select an integrated provider to grab files from it and create a knowledge base with them
- `/connections/[connectionId]` - Connection page, explore the resources of a connected provider
- `/knowledge-bases/[knowledgeBaseId]` - Knowledge base page, inspect the resources it has and remove (de-index) them

After some considerations, I came to the conclusion that, despite the Notebook dealing with connections first, this task is Knowledge Base first: this is an app to create knowledge bases and connections are just a support for this operation. This way, the landing page has been defined as an entry point to that creation process, telling the user to select a connection. Selecting resources and finally submitting using a modal comes next.

The knowledge base page is established as an independent one. Yes, you go to it after the knowledge base creation, but with the path to an existing knowledge base, you can also reach it without knowing anything about connections.

## Technical choices

### File Explorer

Let's speak about the main goal of the task. Given the screenshot provided with the description showed a **tree structure**, I decided that achieving that structure was the North Star of my work. I started using the Table component from Shadcn with the idea of *upgrading* to Tanstack Table whenever that check was achieved.

The main strategy behind this tree-like File Explorer is recursion, a not very usual strategy in React despite this library leaning much towards functional programming. Inserting children rows right below the parent was way easier with it, both for the styling part (left offset for the elements) and the data retrieval part (the API didn't provide anything nested, only the current level; recursion made fetching child levels on demand simple).

This strategy has its risks, as avoiding infinite loops is on the side of the developer; but with the right hygiene it's achievable and someone with proper knowledge of the rules should be able to deal with it safely.

Speaking about rules, hooks rules were an important constraint for this strategy. Hooks cannot be run in the iteration of a loop, at least not in the body of a component. With SWR, the best way to deal with this was making a component for a single row and giving it the responsibility of fetching its children. Other strategies could have been using a more complex fetcher for a single SWR hook (although it would probably be very hard to maintain and too heavy for what the UI may demand sometimes). Tanstack Query has another tool to deal with this: the `useQueries` hook allows it to use a variable number of queries, each one with its specific key and its place in the cache, with a single hook. Probably worth exploring.

Inside the codebase, it can be appreciated that my explorers used a strategy based on primitives and wrappers. This provided a high degree of modularity that made it easy to have two variants of essentially the same base design, one for the connection and one for the knowledge base.

Having achieved that, my focus was on mutations and user experience. I didn't find enough time and ease to adapt my tree approach with recursion to Tanstack Table, so goals like search and sorting that become low-hanging fruit with this library haven't been implemented.

### State management

The address is the main source of truth: active connection and knowledge base are taken from it. It works right and offers top-notch shareability, especially with the login page being able to redirect to the previous page.

Async data from the server is handled with SWR. More on this in the following sections.

The rest of the states were simple enough to be managed with `useState` or some simple custom hook like `useToggle`.

### Client side vs server side

This app works mostly on the **client side**, as if each page were an SPA. This decision was made because it granted me a **quicker setup of the project and the session management** (not the main focus of the task and problems that are usually solved once, solved forever, not the best investment to train and show up skills) and because **it gave SWR a main role inside the project** (given I was mentioned about the StackAI team using it and I never worked with this library before, it is a way to showcase openness and fast adaptability). This doesn't mean that React Server Components haven't been used: the app directory of Next.js has been used and the layout and page files use RSC wherever possible.

Does it make sense in a real case targeting production? Well, the main goal of this task is to build the file explorer, a component very dynamic in both the content it can load and the actions that can be made with it. There are good use cases to move the heavy weight to the server, though: the login page can just be a light HTML file with a server action, middlewares may make redirections due to auth reasons a cleaner experience for the users, without flashing pages that take them to the login page, and the connections list is probably data that changes not very often, so caching it in the backend is probably a win.

Apart from that, SEO is not that key for this app, given most pages are private; but semantics, accessibility and thumbnails for sharing are requirements or wins to consider.

### Session management

I get the Bearer token from login and I attach it to the headers of an API client. The heavyweight of this setup was handled by AI generation to focus on the main thing, although there are some obvious areas of improvement (both for UX and performance). The approach taken by the AI wasn't my favorite either, being more class-based rather than function-based, but it was good enough. Not persisting the session is the most obvious missing point.

### Data fetching

As I said, fetching has been made from the client side using SWR as the main support (with the exception of the login request, which is usually a special case rather than the typical operation of data management). The API client, the services, and the hooks were built using AI from the API description given by the Jupyter Notebook, so I could jump start quickly on the UI, although I added some modifications, especially to the hooks regarding some mutations.

There are some variants in the way to tackle data fetching even with SWR: for the main fetching of each page, I've used the Suspense mode, supported by my own ViewBoundary component, enabling a more declarative way to handle loading and error states almost for free. On the other hand, recursive requests of children nodes in the tree list use a more traditional approach based on flags and without Suspense. I find it simpler to achieve at first for this kind of interaction with a lot of uncertainty and high dynamism.

Essentially, there are two mutations in the app: knowledge base creation and de-indexing files from knowledge bases. The former has the additional constraint of requiring a sync process that runs in the background. Given the uncertainty on when everything could be ready and how many resources could be in the created knowledge base (by selecting directories, it might have resources that weren't even fetched yet), I discarded optimistic updates and added a delay of 10 seconds to the modal submission even after the creation of the knowledge base has been reported successfully. Otherwise, the user would be driven to a knowledge base page without content and without a manual way to refresh (that would have been a nice addition, by the way).

The other mutation, the de-indexing, is the one that has an optimistic update implemented. Being a microinteraction with a highly predictable result, it was a reasonable target, although updating infinite queries wasn't exactly trivial. Given my lack of experience with SWR, I followed some recommendations from AI models, but the result wasn't satisfactory. I finally found a clever way to achieve it on my own right in the very same hook I use to handle the infinite fetching of the resources.

Infinite loading was a target; but it wasn't achieved because sending the `cursor` query parameter to the API resulted in 500 errors.

### Overall quality

Trying to keep things lean, I didn't enforce a constraining architecture; but some layering and separation of concerns were still something to respect. A `domain` folder was defined to settle this, although it only has business-related type definitions and a helper function that processes a collection of resources.

The rest of the file structure is more functional: components, hooks, lib utils. I consider `/lib/api` to hold a little more things than desired; but it's not too bad for the size of this project.

## Next steps to consider

- Integrate Tanstack Table, refactoring the current File explorer as needed.
- Persist session and handle redirections using the Next.js middleware rather than event handlers and effects.
- Login as a fully React Server Component.
- Server prefetch of connections (perhaps for the first level of resources too).
- Logout with cleanup of the SWR cache.
- Dealing with the cache of directories that become orphan when all their children are de-indexed.
- Theming.
- Reordering files.

## About the use of AI

AI has been taken as a support tool to reach higher speed. Firstly, it was proposed to design a roadmap of tasks and then it was asked to follow tasks one by one. The results weren't great, although good enough for the heavyweight of stuff like setting up an API client and achieving auth; but the roadmap failed at discovering a reasonable flow for the user around connections and knowledge bases, so that approach was quickly cut.

Onwards, AI was used to give a first draft of smaller and more focused elements, with higher guidance from my own. This helped me at skipping the dangers of the blank slate and some specific requests that were solved very quickly, like the feature of filtering out duplicated resources, while keeping the controls was key for making the file structure work and having a proper orchestration all around the app.

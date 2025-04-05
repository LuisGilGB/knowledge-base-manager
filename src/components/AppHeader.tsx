import Link from "next/link";

const AppHeader = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between px-4 md:px-6 border-b shadow-md z-40 bg-background">
      <Link href="/" className="flex items-center">
        <h1 className="text-xl font-bold">TestackAI</h1>
      </Link>
    </header>
  )
}

export default AppHeader;

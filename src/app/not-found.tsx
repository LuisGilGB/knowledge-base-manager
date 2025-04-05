import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-center">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" >Return Home</Link>
    </div>
  )
}

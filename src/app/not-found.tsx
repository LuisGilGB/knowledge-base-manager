import Link from 'next/link'
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-center">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" >
        <Button className="w-fit">Return Home</Button>
      </Link>
    </div>
  )
}

'use-client'
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="text-9xl font-bold text-primary/20 select-none">404</div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground text-balance">Page Not Found</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-md mx-auto">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

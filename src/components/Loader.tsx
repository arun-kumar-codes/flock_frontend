"use client"

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center theme-bg-primary">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-4">
          {/* Outer spinner */}
          <div className="w-12 h-12 rounded-full border-4 theme-border border-t-indigo-600 animate-spin"></div>

          {/* Inner spinner (purple) with delay */}
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-purple-500 animate-spin [animation-delay:150ms]"></div>
        </div>

        {/* Centered text */}
        <p className="text-lg font-medium theme-text-secondary">Loading...</p>
      </div>
    </div>
  )
}

export default Loader

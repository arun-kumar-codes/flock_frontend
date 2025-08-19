"use client"

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="text-center">
        <div className="relative mx-auto mb-4">
          <div className="w-12 h-12 rounded-full border-4  border-t-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-purple-500 animate-spin animation-delay-150"></div>
        </div>
        <p className="text-lg font-medium theme-text-secondary mr-10">Loading...</p>
      </div>
    </div>
  )
}

export default Loader
'use client'

import React from 'react'

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-600">Loading...</p>
        </div>
      </div>
  )
}

export default Loader

Logout
About Us
Portfolio
References
ROI
News
Plan a Visit
Contact

'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("GLOBAL ERROR CAUGHT:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-700 mb-4">We encountered a Server Error. Here are the details:</p>
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 font-mono text-sm overflow-auto">
          {error.message || "No error message provided."}
        </div>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-6">Error Digest: {error.digest}</p>
        )}
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

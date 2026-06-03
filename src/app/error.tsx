'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-[20px] font-semibold text-[#0B2447] tracking-tight mb-2">Something went wrong</h1>
        <p className="text-slate-600 mb-6">
          An unexpected error occurred. This might be a temporary issue.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-[#0B2447] text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

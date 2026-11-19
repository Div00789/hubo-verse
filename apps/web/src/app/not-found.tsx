import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h1 className="text-6xl font-extrabold text-[#FF5C00]">404</h1>
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-sm text-gray-400 max-w-md">
        The requested resource could not be found. Please check the URL or return to the home page.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}


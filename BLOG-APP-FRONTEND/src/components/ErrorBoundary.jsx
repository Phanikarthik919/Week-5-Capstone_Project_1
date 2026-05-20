import { useRouteError, Link } from "react-router-dom";

function ErrorBoundary() {
  const error = useRouteError();
  const status = error?.status || 404;
  const statusText = error?.statusText || "Not Found";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-4">{status} - Something went wrong</h1>
      <p className="text-xl text-gray-600 mb-8">{statusText}</p>
      <Link to="/home" className="px-6 py-2 bg-[#1d1d1f] text-white rounded-full">
        Go back Home
      </Link>
    </div>
  );
}

export default ErrorBoundary;
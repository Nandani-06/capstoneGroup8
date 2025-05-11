"use client";

import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    // Call the API to clear the token
    await fetch("/api/logout", { method: "POST" });

    // Redirect to the login page
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Logout</h1>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
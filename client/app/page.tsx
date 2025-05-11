'use client'

import { useRouter } from 'next/navigation';

export default function ProcessPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call API to clear the token
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        // Redirect to login page after successful logout
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto py-20 px-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
      {/* Main content */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to the Einstein First & Quantum Girls Database</h1>
        <p className="text-gray-600 mb-8 text-lg">
          This system allows you to upload, preview, and manage data of the Einstein First and Quantum Girls.
        </p>
        <p className="text-gray-500 mb-4">
          Use the sidebar to navigate to the <strong>Data Upload</strong> and <strong>Data Preview</strong> sections.
        </p>
      </div>
      
      {/* Centered logout button at the bottom with improved styling */}
      <button 
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md"
      >
        <span className="mr-2">Logout</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
}
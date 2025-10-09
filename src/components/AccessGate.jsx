import React, { useState, useEffect } from "react";
import API from "../api/api";

const AccessGate = ({ children }) => {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessGranted = localStorage.getItem("access_granted");
    if (accessGranted === "true") {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await API.post("/verify-access/", { password });
      if (res.data.authorized) {
        localStorage.setItem("access_granted", "true");
        setAuthorized(true);
      } else {
        setError("Incorrect password. Try again.");
      }
    } catch {
      setError("Incorrect password. Try again.");
    }
    setLoading(false);
  };

  if (authorized) return children; // 👈 Show full app

  // 👇 Show password form until authorized
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 md:w-[40%] w-full rounded-lg shadow-md  ">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Enter Access Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>
        {error && (
          <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AccessGate;

"use client";

import { useEffect, useState } from "react";

export default function WelcomeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("seenWelcome");

    if (!hasSeen) {
      setShow(true);
      localStorage.setItem("seenWelcome", "true");
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl text-center">
        
        <h2 className="text-2xl font-bold mb-3">
          Welcome to Scripture Lives 🙏
        </h2>

        <p className="text-gray-600 mb-4">
          Take a moment. Breathe. Reset your mind.
        </p>

        <p className="text-gray-600 mb-4">
          You're not here by accident — God may have something for you today.
        </p>

        <p className="text-gray-600 mb-4">
          Dive into today’s devotional, reflect on His Word, and let your faith grow one step at a time.
        </p>

        <p className="text-gray-500 italic mb-6">
          “Draw near to God, and He will draw near to you.” — James 4:8
        </p>

        <button
          onClick={() => setShow(false)}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Start My Devotional
        </button>
      </div>
    </div>
  );
}
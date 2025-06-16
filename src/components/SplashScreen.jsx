"use client";
import React from "react";

function SplashScreen() {
  return (
    <main
      className="flex overflow-hidden flex-col justify-center items-center px-10 pt-40 bg-white pb-[300px] max-md:px-5 max-md:py-24"
      role="main"
      aria-label="Welcome splash screen"
    >
      <section className="max-w-full w-[330px]">
        <figure className="flex relative flex-row items-start px-8 pt-2 pb-6 w-full aspect-[1.447] max-md:px-5">
          <img
            src="/AstroIcon.png"
            alt="Background decoration"
            className="object-cover absolute inset-0 w-full h-full"
            role="presentation"
          />
        </figure>
      </section>
      
      {/* Big purple title below the image */}
      <p className="mt-6 text-purple-700 text-5xl font-bold">ASTRO SỐ</p>
      
      <button className="mt-10 bg-purple-500 text-white text-2xl font-bold py-2 px-4 rounded inline-flex items-center">
        <svg
          className="animate-spin h-5 w-5 mr-3 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </button>
    </main>
  );
}

export default SplashScreen;
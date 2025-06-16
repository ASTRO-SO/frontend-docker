
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { ArticlesSection } from "./ArticlesSection";
import Footer from "./Footer";
import SplashScreen from "../SplashScreen";

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin and redirect if needed
    const userRole = localStorage.getItem("userRole");
   if (userRole === "admin") {
     navigate("/admin");
      return;
    }

    // Otherwise continue with normal loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
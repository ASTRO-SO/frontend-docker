"use client";
import React, { useState } from "react";

import { MainContent } from "./MainContent";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";

const Introduction = () => {
  const [activeTab, setActiveTab] = useState("numerology");

  return (
    <div className="flex overflow-hidden flex-col bg-white text-white">
      <Header />
      <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
      <Footer />
    </div>
  );
};

export default Introduction;

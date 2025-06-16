"use client";
import React from "react";
import Header from "../Homepage/Header.jsx"
import GuideContent from "./GuideContent";
import Footer from "../Homepage/Footer.jsx"

function HuongDan() {
  return (
    <div className="flex overflow-hidden flex-col pb-2.5 bg-white">
      <Header />
      <GuideContent />
      <Footer />
    </div>
  );
}

export default HuongDan;

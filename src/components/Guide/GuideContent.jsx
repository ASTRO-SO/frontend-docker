import React from "react";
import GuideTableOfContents from "./GuideTableOfContents";
import GuideInstructions from "./GuideInstructions";

function GuideContent() {
  return (
    <main className="flex flex-col self-center mt-14 w-full text-lg tracking-widest leading-5 text-black max-w-[1208px] max-md:mt-10 max-md:max-w-full">
      <h2 className="self-start text-2xl font-semibold leading-none tracking-[2.4px] max-md:max-w-full">
        Hướng dẫn tra cứu Thần số học cho người mới bắt đầu
      </h2>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6575f0b52349232d3690e507f3efb2961a1e2fc7?placeholderIfAbsent=true&apiKey=6e743882ea0247f9a6dcafe87515ad1c"
        alt="Thần số học guide banner"
        className="object-contain mt-3 w-full aspect-[1.79] max-md:max-w-full"
      />
      <GuideTableOfContents />
      <GuideInstructions />
    </main>
  );
}

export default GuideContent;

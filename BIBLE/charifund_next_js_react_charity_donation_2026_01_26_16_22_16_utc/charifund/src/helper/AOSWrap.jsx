"use client";
import dynamic from "next/dynamic";
import InitializeAOS from "./InitializeAOS";

const AOSWrapper = dynamic(() => import("@/helper/AOSWrapper"), {
  ssr: false,
});

const AOSWrap = ({ children }) => {
  return (
    <AOSWrapper>
      <InitializeAOS />
      {children}
    </AOSWrapper>
  );
};

export default AOSWrap;

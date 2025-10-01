import React from "react";
import s from "../styles/Home.module.scss";
import Hero from "../components/Hero.jsx";
import WhySort from "../components/WhySort.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Leaderboard from "../components/Leaderboard.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <WhySort />
      <HowItWorks />
      <Leaderboard />
    </>
  );
}

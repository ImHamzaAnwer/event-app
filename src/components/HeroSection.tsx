/* eslint-disable @next/next/no-img-element */
"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { animateWithGsap } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const HeroSection = () => {
  useGSAP(() => {
    animateWithGsap("#hero_title", {
      opacity: 1,
      y: 0,
      duration: 3,
    });

    animateWithGsap("#hero_subtitle", {
      opacity: 1,
      y: 12,
      duration: 2,
    });

    gsap.fromTo(
      "#knot",
      { rotate: 0 },
      {
        rotate: 360,
        scrollTrigger: {
          trigger: "#root",
          start: "top top",
          end: "bottom top",
          scrub: true,
          markers: {
            indent: 50,
            startColor: "red",
            endColor: "red",
          },
        },
      }
    );
  }, []);

  return (
    <section
      id="hero-section"
      className="relative text-white bg-black px-10 w-full flex flex-col justify-center text-center h-[calc(100vh-70px)]"
    >
      <img
        aria-hidden="true"
        alt="Logo Background"
        id="knot"
        src={"/icons/logo.png"}
        className="w-full h-full absolute inset-0 z-0 object-contain opacity-10"
      />
      <h1 id="hero_title" className="font-heading text-6xl opacity-0 font-bold">
        Hub of Arts and Culture
      </h1>
      <p id="hero_subtitle" className="opacity-0 text-xl">
        Committed to the promotion, education and preservation of art and
        culture since 1955
      </p>
    </section>
  );
};

export default HeroSection;

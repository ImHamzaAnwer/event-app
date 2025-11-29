"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { animateWithGsap } from "@/lib/utils";
import { Music } from "lucide-react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useGSAP(() => {
    gsap.to(".box", {
      y: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    animateWithGsap("#hero_title", { opacity: 1, y: 0, duration: 3 });
    animateWithGsap("#hero_subtitle", { opacity: 1, y: 10, duration: 4 });
  }, []);

  return (
    <>
      <section className="relative bg-[#e6ccb2] text-[#6f1d1b] min-h-screen overflow-hidden">
        <div className="px-10 flex flex-col justify-center min-h-screen">
          <h1 id="hero_title" className="text-5xl opacity-0 font-bold">
            A Night of Waltzes & Wonders
          </h1>
          <p id="hero_subtitle" className="opacity-0">
            Romance, joy, and timeless melodies that make nights unforgettable
          </p>

          <button
            type="button"
            className="cursor-pointer w-max mt-5 text-white rounded-sm px-5 py-2 flex items-center gap-x-1 bg-linear-to-r from-rose-600 to-rose-700"
          >
            <Music width={18} height={18} /> Experience
          </button>
        </div>
        <Image
          height={900}
          width={900}
          className="box object-contain absolute -top-100 -right-70"
          alt=""
          src="/images/violin.png"
        />
      </section>
    </>
  );
};

export default Home;

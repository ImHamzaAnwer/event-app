"use client";

import gsap from "gsap";
import Image from "next/image";
import { useLayoutEffect } from "react";

export default function Partners() {
  const partners = [
    { name: "Partner 1", logoUrl: "/images/partners/pepsi.png" },
    { name: "Partner 2", logoUrl: "/images/partners/snapchat.png" },
    { name: "Partner 3", logoUrl: "/images/partners/unilever.png" },
    { name: "Partner 4", logoUrl: "/images/partners/microsoft.png" },
    { name: "Partner 5", logoUrl: "/images/partners/wwf.jpg" },
    { name: "Partner 6", logoUrl: "/images/partners/bmw.png" },
    { name: "Partner 7", logoUrl: "/images/partners/nike.png" },
    { name: "Partner 8", logoUrl: "/images/partners/rl.png" },
    { name: "Partner 9", logoUrl: "/images/partners/tesla.png" },
  ];

  const partners_2 = [
    { name: "Partner 1", logoUrl: "/images/partners/pepsi.png" },
    { name: "Partner 2", logoUrl: "/images/partners/snapchat.png" },
    { name: "Partner 3", logoUrl: "/images/partners/unilever.png" },
    { name: "Partner 4", logoUrl: "/images/partners/microsoft.png" },
    { name: "Partner 5", logoUrl: "/images/partners/wwf.jpg" },
    { name: "Partner 6", logoUrl: "/images/partners/bmw.png" },
    { name: "Partner 7", logoUrl: "/images/partners/nike.png" },
    { name: "Partner 8", logoUrl: "/images/partners/rl.png" },
    { name: "Partner 9", logoUrl: "/images/partners/tesla.png" },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tracks = document.getElementsByClassName("scroll-section");
      if (tracks.length === 0) return;

      Array.from(tracks).map((track: Element) => {
        track.innerHTML += track.innerHTML;

        const totalWidth = track.scrollWidth / 2;
        const isReverse = track.classList.contains("reverse");

        gsap.fromTo(
          track,
          { x: isReverse ? 0 : -totalWidth },
          {
            x: isReverse ? -totalWidth : 0,
            duration: 14,
            ease: "linear",
            repeat: -1,
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <p className="text-4xl font-bold text-center">Collaborations</p>

      <div className="scroll-section flex items-center mt-14 whitespace-nowrap">
        {partners.map((partner, index) => (
          <Image
            width={80}
            height={80}
            key={index}
            src={partner.logoUrl}
            alt={partner.name}
            className="w-20 h-20 mx-10 object-contain"
          />
        ))}
      </div>

      <div className="scroll-section reverse flex items-center mt-14 whitespace-nowrap">
        {partners_2.map((partner, index) => (
          <Image
            width={80}
            height={80}
            key={index}
            src={partner.logoUrl}
            alt={partner.name}
            className="w-20 h-20 mx-10 object-contain"
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-0 top-0 h-full w-30 bg-linear-to-r from-white to-white/0" />
      {/* Right Fade */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-30 bg-linear-to-l from-white to-white/0" />
    </section>
  );
}

/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const itemsData = [
  {
    id: 1,
    title: "The World Culture Festival",
    desc: "The World Culture Festival is a vibrant celebration of global creativity, bringing together artists, creators, and producers from around the world to share their cultures and co-create art. Featuring performances in music, theatre, dance, and visual arts, the festival is a dynamic platform for artistic exchange and cultural dialogue.",
    video:
      "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4",
  },
  {
    id: 2,
    title: "Aalmi Urdu Conference",
    desc: "The Aalmi Urdu Conference returns to the Arts Council of Pakistan, Karachi, with the 17th year spotlighting Karachi - the vibrant city that has shaped the Nations very soul. This year’s theme centres on delving into the city’s rich heritage of literature, music, dance, theatre, and art, all through the lens of Urdu.",
    video:
      "https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4",
  },
  {
    id: 3,
    title: "Pakistan Literature Festival",
    desc: "The Pakistan Literature Festival is a first-of-its-kind mega event in the country. The festival will celebrate and honor our culture, languages, literature, and art on a global scale in a way that has never been done before.",
    video:
      "https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4",
  },
  {
    id: 4,
    title: "Pakistan Theatre Festival",
    desc: "Pakistan Theatre Festival 2023, presented by Arts Council of Pakistan, Karachi, is a landmark event that transcends borders and languages. Featuring a dynamic lineup of 7 international and 27 prominent national theatre groups, this festival spans an incredible 30 days. Immerse yourself in the magic of 45 captivating shows, interactive workshops, and talks. Explore global cultural diversity and a variety of genres under one roof, with plays in languages including Urdu, English, Turkish, German, Sinhala, Persian, Punjabi, and Sindhi.",
    video:
      "https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4",
  },
  {
    id: 5,
    title: "Women Conference",
    desc: "The Women Conference, hosted by the Arts Council of Pakistan, Karachi, is a powerful platform celebrating women's achievements and addressing their challenges. This inspiring event brings together leaders, activists, and visionaries to foster dialogue, empowerment, and change through engaging discussions, workshops, and performances.",
    video:
      "https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4",
  },
];

const ProgramsPage = () => {
  useEffect(() => {
    const scrollSections = document.querySelectorAll(".scroll-section");

    scrollSections.forEach((section) => {
      const wrapper = section.querySelector(".wrapper");
      if (!wrapper) return;
      const items = wrapper.querySelectorAll(".item");

      const direction = section.classList.contains("vertical-section")
        ? "vertical"
        : "horizontal";

      // Initialize positions
      items.forEach((item, index) => {
        if (index !== 0) {
          direction === "horizontal"
            ? gsap.set(item, { xPercent: 100 })
            : gsap.set(item, { yPercent: 100 });
        }
      });

      // Timeline for stacking scroll
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: () => `+=${items.length * 100}%`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      items.forEach((item, index) => {
        timeline.to(item, { scale: 0.9, borderRadius: "10px" });

        if (items[index + 1]) {
          direction === "horizontal"
            ? timeline.to(items[index + 1], { xPercent: 0 }, "<")
            : timeline.to(items[index + 1], { yPercent: 0 }, "<");
        }
      });
    });
  }, []);

  return (
    <>
    <div className="scroll-section vertical-section section overflow-hidden bg-black">
      <div className="wrapper h-screen">
        {itemsData.map((item) => (
          <div
            key={item.id}
            role="listitem"
            className="item w-screen h-full grid grid-cols-2 absolute inset-0 shadow-[0px_8px_24px_rgba(149,157,165,0.2)] overflow-hidden"
          >
            {/* CONTENT */}
            <div className="item_content h-full bg-white text-[#292929] flex flex-col justify-center items-start p-12 relative">
              <h2 className="item_number text-[1.5rem] h-12 w-12 mb-2 rounded-full bg-black text-white flex items-center justify-center font-normal absolute top-24 left-12 sm:text-[0.5rem] sm:top-6">
                {item.id}
              </h2>
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="item_p mt-2">{item.desc}</p>
            </div>

            {/* MEDIA */}
            <video
              className="item_media object-cover h-full"
              src={item.video}
              autoPlay
              muted
              loop
              playsInline
              // loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
    <div className="scroll-section horizontal-section section overflow-hidden bg-black">
      <div className="wrapper h-screen">
        {itemsData.map((item) => (
          <div
            key={item.id}
            role="listitem"
            className="bg-orange-500 item w-screen h-full grid grid-cols-2 absolute inset-0 shadow-[0px_8px_24px_rgba(149,157,165,0.2)] overflow-hidden"
          >
            {/* CONTENT */}
            <div className="item_content h-full bg-white text-[#292929] flex flex-col justify-center items-start p-12 relative">
              <h2 className="item_number text-[1.5rem] h-12 w-12 mb-2 rounded-full bg-black text-white flex items-center justify-center font-normal absolute top-24 left-12 sm:text-[0.5rem] sm:top-6">
                {item.id}
              </h2>
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="item_p mt-2">{item.desc}</p>
            </div>

            {/* MEDIA */}
            <video
              className="item_media object-cover h-full"
              src={item.video}
              autoPlay
              muted
              loop
              playsInline
              // loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ProgramsPage;

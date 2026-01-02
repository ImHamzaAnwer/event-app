"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const itemsData = [
  {
    id: 1,
    title: "The World Culture Festival",
    desc: "The World Culture Festival is a vibrant celebration of global creativity, bringing together artists, creators, and producers from around the world to share their cultures and co-create art. Featuring performances in music, theatre, dance, and visual arts, the festival is a dynamic platform for artistic exchange and cultural dialogue.",
    img: "https://images.pexels.com/photos/54276/pexels-photo-54276.jpeg",
  },
  {
    id: 2,
    title: "Aalmi Urdu Conference",
    desc: "The Aalmi Urdu Conference returns to the Arts Council of Pakistan, Karachi, with the 17th year spotlighting Karachi - the vibrant city that has shaped the Nations very soul. This year’s theme centres on delving into the city’s rich heritage of literature, music, dance, theatre, and art, all through the lens of Urdu.",
    img: "https://images.pexels.com/photos/2240891/pexels-photo-2240891.jpeg",
  },
  {
    id: 3,
    title: "Pakistan Literature Festival",
    desc: "The Pakistan Literature Festival is a first-of-its-kind mega event in the country. The festival will celebrate and honor our culture, languages, literature, and art on a global scale in a way that has never been done before.",
    img: "https://images.pexels.com/photos/33719428/pexels-photo-33719428.jpeg",
  },
  {
    id: 4,
    title: "Pakistan Theatre Festival",
    desc: "Pakistan Theatre Festival 2023, presented by Arts Council of Pakistan, Karachi, is a landmark event that transcends borders and languages. Featuring a dynamic lineup of 7 international and 27 prominent national theatre groups, this festival spans an incredible 30 days. Immerse yourself in the magic of 45 captivating shows, interactive workshops, and talks. Explore global cultural diversity and a variety of genres under one roof, with plays in languages including Urdu, English, Turkish, German, Sinhala, Persian, Punjabi, and Sindhi.",
    img: "https://images.pexels.com/photos/2888802/pexels-photo-2888802.jpeg",
  },
  {
    id: 5,
    title: "Women Conference",
    desc: "The Women Conference, hosted by the Arts Council of Pakistan, Karachi, is a powerful platform celebrating women's achievements and addressing their challenges. This inspiring event brings together leaders, activists, and visionaries to foster dialogue, empowerment, and change through engaging discussions, workshops, and performances.",
    img: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg",
  },
];

const ProgramsPage = () => {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollSection = document.querySelector(".programs");
      if (!scrollSection) return;

      const wrapper = scrollSection.querySelector(".wrapper");
      if (!wrapper) return;

      const items = wrapper.querySelectorAll(".item");

      items.forEach((item, index) => {
        if (index !== 0) {
          gsap.set(item, { xPercent: 120 });
        }
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSection,
          pin: true,
          start: "top top",
          end: () => `+=${items.length * 100}%`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      items.forEach((item, index) => {
        timeline.to(item, {
          scale: index !== items.length - 1 ? 0.9 : 1,
          borderRadius: "10px",
        });

        if (items[index + 1]) {
          timeline.to(items[index + 1], { xPercent: 0 }, "<");
        }
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="programs h-screen bg-black px-6 py-10 overflow-hidden">
      <h2 className="text-white text-4xl mb-10 font-heading">
        Our Initiatives
      </h2>
      <div className="wrapper relative">
        {itemsData.map((item) => (
          <div
            key={item.id}
            role="listitem"
            className="rounded-sm h-[500px] item grid grid-cols-2 absolute overflow-hidden grow"
          >
            {/* CONTENT */}
            <div className="item_content h-full bg-white text-[#292929] flex flex-col justify-center items-start p-12 relative">
              <h2 className="absolute top-10 hidden md:flex item_number h-12 w-12 mb-2 rounded-full bg-black text-white  items-center justify-center font-normal">
                {item.id}
              </h2>
              <h2 className="text-2xl font-semibold text-red-600">
                {item.title}
              </h2>
              <p className="item_p mt-2">{item.desc}</p>
            </div>

            {/* MEDIA */}
            <Image
              alt=""
              className="item_media object-cover h-full"
              src={item.img}
              loading="lazy"
              height={500}
              width={700}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProgramsPage;

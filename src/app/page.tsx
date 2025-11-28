import ExploreBtn from "@/components/ExploreBtn";

const Home = async () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for every Dev <br /> Event you can&apos;t miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Workshops, Conferences, and more - all in one place
      </p>

      <ExploreBtn />
    </section>
  );
};

export default Home;

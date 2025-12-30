import HeroSection from "@/components/HeroSection";
import ProgramsPage from "@/components/ProgramSection";
import UpcomingEvents from "@/components/UpcomingEvents";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <UpcomingEvents />
      <ProgramsPage />
      {/* <div className="h-[500px] bg-red-300"/> */}
      {/* <div className="h-[200vh] bg-red-600"/> */}
    </div>
  );
};

export default Home;

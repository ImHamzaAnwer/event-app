import HeroSection from "@/components/HeroSection";
import ProgramsPage from "@/components/ProgramSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <ProgramsPage />
      <div className="h-[500px] bg-red-300"/>
      {/* <div className="h-[200vh] bg-red-600"/> */}
    </div>
  );
};

export default Home;

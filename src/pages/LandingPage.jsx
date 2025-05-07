import Header from "../components/Header";
import Hero from "../components/Hero";
import Beneficios from "../components/Beneficios";
import HowWork from "../components/HowWork";

export default function LandingPage() {
    return (
      <div>
        <div className="mb-6 m">
        <Header />
        </div>
        <Hero />
        <Beneficios />
        <HowWork />
      </div>
    );
  }
  
import Header from "../components/Header";
import Hero from "../components/Hero";
import Beneficios from "../components/Beneficios";
import HowWork from "../components/HowWork";
import CasosDeUso from "../components/CasosDeUso";
import PlanesDePrecio from "../components/PlanesDePrecios";
import Footer from "../components/Footer";

export default function LandingPage() {
    return (
      <div>
        <div className="mb-6 m">
        <Header />
        </div>
        <Hero />
        <Beneficios />
        <CasosDeUso />
        <HowWork />
        <PlanesDePrecio />
        <Footer />
      </div>
    );
  }
  
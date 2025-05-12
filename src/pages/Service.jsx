import Header from "../components/Header";
import About from "../components/About";
import ServicesList from "../components/ServicesList";
import Footer from "../components/Footer";

export default function Service() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="px-4 py-16 max-w-6xl mx-auto space-y-20">
        <About />
        <ServicesList />
      </main>
      <Footer />
    </div>
  );
}

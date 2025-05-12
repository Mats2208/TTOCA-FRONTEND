import PlanCard from "../components/PlanCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

const planes = [
  {
    nombre: "Básico",
    precio: "$2.99",
    periodo: "/mes",
    descripcion: "Ideal para negocios pequeños",
    caracteristicas: [
      "1 cola virtual",
      "Hasta 50 turnos diarios",
      "Notificaciones básicas",
    ],
  },
  {
    nombre: "Pro",
    precio: "$9.99",
    periodo: "/mes",
    descripcion: "Para negocios en crecimiento",
    caracteristicas: [
      "5 colas virtuales",
      "Turnos ilimitados",
      "Estadísticas avanzadas",
      "Personalización de marca",
    ],
  },
  {
    nombre: "Empresarial",
    precio: "$24.99",
    periodo: "/mes",
    descripcion: "Solución completa para empresas",
    caracteristicas: [
      "Colas ilimitadas",
      "Turnos ilimitados",
      "API completa",
      "Soporte prioritario",
      "Integración con CRM",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="bg-[#f3f4f6] text-gray-800 min-h-screen">
      <Header />
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full mb-4">
          Precios
        </span>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Planes flexibles para cada necesidad
        </h2>
        <p className="text-gray-700 mb-12 max-w-xl mx-auto">
          Elige el plan ideal y comienza a optimizar tus colas virtuales hoy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <PlanCard key={plan.nombre} {...plan} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

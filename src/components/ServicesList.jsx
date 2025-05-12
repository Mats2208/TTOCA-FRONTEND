// src/components/ServicesList.jsx
"use client";

import { CheckCircle, Server, Smartphone, Clock3 } from "lucide-react";

const servicios = [
  {
    icon: <Smartphone className="w-8 h-8 text-blue-600" />,
    titulo: "Colas Virtuales",
    descripcion: "Permite a tus clientes tomar turnos desde sus dispositivos móviles sin necesidad de estar presentes físicamente.",
  },
  {
    icon: <Clock3 className="w-8 h-8 text-blue-600" />,
    titulo: "Gestión de Turnos",
    descripcion: "Organiza de manera eficiente la atención a tus clientes, mejorando su experiencia y reduciendo esperas.",
  },
  {
    icon: <Server className="w-8 h-8 text-blue-600" />,
    titulo: "Infraestructura Escalable",
    descripcion: "Nuestra plataforma SaaS se adapta a tus necesidades, desde un pequeño local hasta grandes corporaciones.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
    titulo: "Soporte Personalizado",
    descripcion: "Ofrecemos atención técnica y mejoras continuas para garantizar el mejor rendimiento en tu negocio.",
  },
];

export default function ServicesList() {
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold text-blue-700 mb-10">Nuestros Servicios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {servicios.map((servicio, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="mb-4">{servicio.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {servicio.titulo}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {servicio.descripcion}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

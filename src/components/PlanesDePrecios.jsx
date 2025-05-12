"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';

const planes = [
  {
    nombre: "Básico",
    precio: "$2.99",
    periodo: "/mes",
    descripcion: "Ideal para negocios pequeños",
    caracteristicas: ["1 cola virtual", "Hasta 50 turnos diarios", "Notificaciones básicas"],
  },
  {
    nombre: "Pro",
    precio: "$9.99",
    periodo: "/mes",
    descripcion: "Para negocios en crecimiento",
    caracteristicas: ["5 colas virtuales", "Turnos ilimitados", "Estadísticas avanzadas", "Personalización de marca"],
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

export default function PlanesDePrecio() {
  const [planSeleccionado, setPlanSeleccionado] = useState(1);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
            Precios
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mt-4">
            Planes flexibles para cada necesidad
          </h2>
          <p className="text-gray-600 text-lg mt-2 max-w-xl mx-auto">
            Elige el plan ideal y comienza a optimizar tus colas virtuales hoy.
          </p>
        </div>

        {/* Planes - Carrusel en móvil */}
        <div className="md:hidden">
          <Swiper spaceBetween={16} slidesPerView={1.1} centeredSlides={true}>
            {planes.map((plan, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white rounded-2xl border p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800">{plan.nombre}</h3>
                  <p className="text-gray-600 text-sm my-2">{plan.descripcion}</p>
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-4xl font-bold">{plan.precio}</span>
                    <span className="text-gray-500">{plan.periodo}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.caracteristicas.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{c}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/registro"
                    className="mt-6 block text-center py-3 rounded-xl font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Comenzar ahora
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Planes - Grid para escritorio */}
        <div className="hidden md:grid grid-cols-3 gap-6 mt-8">
          {planes.map((plan, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 shadow-lg flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] border-gray-100"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{plan.nombre}</h3>
                <p className="text-gray-600 text-sm my-2">{plan.descripcion}</p>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.precio}</span>
                  <span className="text-gray-500">{plan.periodo}</span>
                </div>
                <ul className="space-y-2">
                  {plan.caracteristicas.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="/registro"
                className="mt-6 block text-center py-3 rounded-xl font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                Comenzar ahora
              </a>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center bg-blue-700 text-white py-10 px-6 rounded-2xl">
          <h3 className="text-3xl font-bold">Listo para transformar tu negocio?</h3>
          <p className="mt-2 text-white/90 max-w-xl mx-auto">
            Activa tu primera cola virtual en menos de 5 minutos. Rápido, simple y efectivo.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
            >
              Ver todos los planes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client"

import { useState, useEffect } from "react"
import { Clock, Users, BarChart } from "lucide-react"

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Texto principal */}
        <div
          className={`text-center md:text-left transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            Cola virtual instantánea. Sin instalaciones.
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
            Digitaliza tus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              filas y turnos
            </span>{" "}
            en minutos
          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto md:mx-0">
            Con <strong>Ttoca</strong> crea una cola virtual lista para usar desde cualquier navegador.
            Sin descargas, sin instalaciones. Una solución SaaS moderna, eficiente y personalizable.
          </p>

          <div className="flex justify-center md:justify-start">
            <a
              href="/pricing"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl text-lg font-medium transition-all duration-300 shadow-md"
            >
              Ver planes y precios
            </a>
          </div>
        </div>

        {/* Imagen ilustrativa */}
        <div
          className={`relative transform transition-all duration-700 delay-300 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <img
              src="../assets/hero-image.png"
              alt="TToca - Sistema de gestión de turnos"
              className="w-full h-auto object-cover"
            />

            {/* Tarjeta superior derecha */}
            <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-md flex items-center gap-3 border border-gray-200 max-w-[180px]">
              <Clock className="text-blue-600 w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">Tiempo estimado</p>
                <p className="text-xs text-gray-500">20 min restantes</p>
              </div>
            </div>

            {/* Tarjeta inferior izquierda */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow-md flex items-center gap-3 border border-gray-200 max-w-[180px]">
              <Users className="text-blue-600 w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">En espera</p>
                <p className="text-xs text-gray-500">17 personas antes que tú</p>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100 rounded-full opacity-50 blur-3xl -z-10"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-50 blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero

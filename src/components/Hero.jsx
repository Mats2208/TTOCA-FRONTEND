"use client"

import { useState, useEffect } from "react"
import { Clock, Users, BarChart } from "lucide-react"
import { Link } from "react-router-dom"

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="bg-gradient-to-br from-gray-50 via-primary-50/20 to-secondary-50/20 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -left-32 top-0 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl animate-pulse-subtle" />
      <div className="absolute -right-32 bottom-0 w-64 h-64 bg-secondary-200/30 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}} />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative">
        {/* Texto principal */}
        <div
          className={`text-center md:text-left transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-block bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-soft border border-primary-200/50">
            ✨ Cola virtual instantánea. Sin instalaciones.
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
            Digitaliza tus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              filas y turnos
            </span>{" "}
            en minutos
          </h1>

          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            Con <strong className="text-primary-700">Ttoca</strong> crea una cola virtual lista para usar desde cualquier navegador.
            Sin descargas, sin instalaciones. Una solución SaaS moderna, eficiente y personalizable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="/pricing"
              className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-elevated text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-card hover:scale-105 active:scale-95"
            >
              Ver planes y precios
            </a>
            <a
              href="/registro"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-primary-700 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-soft border-2 border-primary-200 hover:border-primary-300 hover:shadow-card"
            >
              Probar gratis
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
              src="../assets/Hero-Image.png"
              alt="TToca - Sistema de gestión de turnos"
              className="w-full h-auto object-cover"
            />

            {/* Tarjeta superior derecha */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-card flex items-center gap-3 border-2 border-primary-100 max-w-[180px] animate-slide-down">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-2 rounded-lg">
                <Clock className="text-primary-600 w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Tiempo estimado</p>
                <p className="text-xs text-gray-600">20 min restantes</p>
              </div>
            </div>

            {/* Tarjeta inferior izquierda */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-card flex items-center gap-3 border-2 border-secondary-100 max-w-[200px] animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="bg-gradient-to-br from-secondary-100 to-primary-100 p-2 rounded-lg">
                <Users className="text-secondary-600 w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">En espera</p>
                <p className="text-xs text-gray-600">17 personas antes</p>
                <Link to="/verificar-turno" className="text-primary-600 hover:text-primary-700 font-semibold text-xs">Verificar turno →</Link>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl -z-10 animate-pulse-subtle"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-100 rounded-full opacity-50 blur-3xl -z-10 animate-pulse-subtle" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </section>
  )
}

export default Hero

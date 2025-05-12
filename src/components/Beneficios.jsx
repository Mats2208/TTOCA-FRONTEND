"use client"

import { useState, useEffect, useRef } from "react"
import { Zap, Globe, Settings, Smartphone, ChevronLeft, ChevronRight } from "lucide-react"

const beneficios = [
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    titulo: "Activación instantánea",
    descripcion: "Comienza a usar tu sistema de turnos en segundos, sin necesidad de instalaciones ni técnicos.",
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-50",
  },
  {
    icon: <Globe className="w-6 h-6 text-white" />,
    titulo: "100% en la nube",
    descripcion: "Tus clientes gestionan su turno desde su celular o navegador. Tú controlas todo desde el panel web.",
    color: "from-indigo-500 to-indigo-600",
    lightColor: "bg-indigo-50",
  },
  {
    icon: <Settings className="w-6 h-6 text-white" />,
    titulo: "Personalizable",
    descripcion: "Adapta el sistema de turnos a tu negocio: categorías, mensajes, tiempos y estilos.",
    color: "from-purple-500 to-purple-600",
    lightColor: "bg-purple-50",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-white" />,
    titulo: "Compatible con todos los dispositivos",
    descripcion: "Funciona en smartphones, tablets o PC. Nadie se queda fuera del sistema.",
    color: "from-cyan-500 to-cyan-600",
    lightColor: "bg-cyan-50",
  },
]

const Beneficios = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const carouselRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Navegación del carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === beneficios.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? beneficios.length - 1 : prev - 1))
  }

  // Manejo de gestos táctiles
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide()
    } else if (touchStartX.current - touchEndX.current < -50) {
      prevSlide()
    }
  }

  // Autoplay para el carrusel móvil
  useEffect(() => {
    let interval

    if (isMobile) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMobile, currentSlide])

  return (
    <section className="section-bg py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Beneficios exclusivos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ¿Por qué elegir{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">TToca</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Una solución moderna y eficiente para transformar la experiencia de espera en tu negocio.
          </p>
        </div>

        {/* Vista de escritorio - Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {beneficios.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
              <div className="p-6">
                <div
                  className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl shadow-md mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.titulo}</h3>
                <p className="text-gray-600">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Vista móvil - Carrusel */}
        <div
          className="sm:hidden relative"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <div
              className="transition-transform duration-500 ease-out flex"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {beneficios.map((item, index) => (
                <div key={index} className="min-w-full bg-white">
                  <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                  <div className="p-8">
                    <div
                      className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl shadow-md mb-6 mx-auto`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{item.titulo}</h3>
                    <p className="text-gray-600 text-center">{item.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles del carrusel */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {beneficios.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Ir al beneficio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Beneficios

import React, { useState, useEffect, useRef } from "react";
import { Building2, Utensils, Stethoscope, Briefcase, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const casos = [
  {
    icon: <Utensils className="w-6 h-6 text-white" />,
    titulo: "Restaurantes",
    descripcion: "Evita filas físicas y gestiona turnos desde el celular.",
    color: "from-emerald-500 to-emerald-600",
    beneficios: [
      "Reduce tiempos de espera",
      "Mejora experiencia del cliente",
      "Optimiza flujo de servicio"
    ]
  },
  {
    icon: <Stethoscope className="w-6 h-6 text-white" />,
    titulo: "Clínicas",
    descripcion: "Pacientes organizados sin congestión en recepción.",
    color: "from-sky-500 to-sky-600",
    beneficios: [
      "Organiza citas médicas",
      "Reduce estrés en sala de espera",
      "Mejora gestión de pacientes"
    ]
  },
  {
    icon: <Building2 className="w-6 h-6 text-white" />,
    titulo: "Bancos y servicios",
    descripcion: "Digitaliza colas en instituciones y entes públicos.",
    color: "from-violet-500 to-violet-600",
    beneficios: [
      "Agiliza trámites bancarios",
      "Reduce congestión en sucursales",
      "Mejora satisfacción del cliente"
    ]
  },
  {
    icon: <Briefcase className="w-6 h-6 text-white" />,
    titulo: "Oficinas privadas",
    descripcion: "Clientes atendidos según orden, sin interrupciones.",
    color: "from-amber-500 to-amber-600",
    beneficios: [
      "Optimiza atención al cliente",
      "Elimina interrupciones",
      "Mejora productividad"
    ]
  },
];

const CasosDeUso = () => {
  const [hoverActivo, setHoverActivo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  useEffect(() => {
    if (isMobile && autoplay) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % casos.length);
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isMobile, autoplay]);
  
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % casos.length);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      setAutoplay(false);
    }
  };
  
  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? casos.length - 1 : prevIndex - 1));
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      setAutoplay(false);
    }
  };
  
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 70) {
      nextSlide();
    } else if (touchEnd - touchStart > 70) {
      prevSlide();
    }
  };
  
  const goToSlide = (index) => {
    setActiveIndex(index);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      setAutoplay(false);
    }
  };

  return (
    <section className="section-bg py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Usos reales
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ideal para todo tipo de negocios
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Desde clínicas hasta bancos, Ttoca es adaptable y efectivo para cualquier negocio que gestione colas de clientes.
          </p>
        </div>        {isMobile ? (
          <div className="relative px-4 sm:px-0">
            <div 
              className="overflow-visible md:overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-300 ease-in-out" 
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {casos.map((item, index) => (
                  <div key={index} className="min-w-full">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative h-full mx-1">
                      <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                      <div className="p-4 sm:p-6">
                        <div
                          className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${item.color} rounded-xl shadow-md mb-4 sm:mb-6 mx-auto transition-transform duration-300`}
                        >
                          {item.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{item.titulo}</h3>
                        <p className="text-gray-600 text-sm mb-3 sm:mb-4">{item.descripcion}</p>
                        
                        <ul className="mt-2 space-y-2 pb-2">
                          {item.beneficios.map((beneficio, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{beneficio}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              <button 
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 sm:p-2 shadow-md z-20 hover:bg-gray-100"
              onClick={prevSlide}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button 
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 sm:p-2 shadow-md z-20 hover:bg-gray-100"
              onClick={nextSlide}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            
            <div className="flex justify-center mt-6 space-x-2">
              {casos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-300">
            {casos.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
                onMouseEnter={() => setHoverActivo(true)}
                onMouseLeave={() => setHoverActivo(false)}
                onTouchStart={() => setHoverActivo(!hoverActivo)}
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-6">
                  <div
                    className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl shadow-md mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.descripcion}</p>

                  <div
                    className={`transition-all duration-300 ${
                      hoverActivo ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="mt-2 space-y-2">
                      {item.beneficios.map((beneficio, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CasosDeUso;
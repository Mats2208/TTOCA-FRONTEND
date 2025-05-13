"use client";

import { useEffect, useRef, useState } from "react";
import { UserPlus, ClipboardList, Share2, Eye, ArrowRight } from "lucide-react";

const pasos = [
  {
    icon: <UserPlus className="w-6 h-6 text-white" />,
    titulo: "Regístrate",
    descripcion: "Crea una cuenta gratis y accede al panel administrativo desde cualquier navegador.",
    imagen: "/src/assets/HWSTEP1.png?height=240&width=320",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-white" />,
    titulo: "Crea tu sistema de turnos",
    descripcion: "Define tus preferencias, categorías y mensaje de bienvenida. Todo en segundos.",
    imagen: "/src/assets/HWSTEP2.PNG?height=240&width=320",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: <Share2 className="w-6 h-6 text-white" />,
    titulo: "Comparte el enlace",
    descripcion: "Tus clientes acceden al sistema desde su celular escaneando un QR o con un enlace.",
    imagen: "/src/assets/Hero-Image.png?height=240&width=320",
    color: "from-blue-700 to-blue-800",
  },
  {
    icon: <Eye className="w-6 h-6 text-white" />,
    titulo: "Gestiona turnos",
    descripcion: "Ve quién está en espera, llama al siguiente y controla todo en tiempo real.",
    imagen: "/src/assets/HWSTEP4.png?height=240&width=320",
    color: "from-blue-800 to-blue-900",
  },
];

const HowWork = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("how-work-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === pasos.length - 1 ? 0 : prev + 1));
      setCurrentSlide((prev) => (prev === pasos.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) setCurrentSlide((prev) => (prev + 1) % pasos.length);
    if (delta < -50) setCurrentSlide((prev) => (prev === 0 ? pasos.length - 1 : prev - 1));
  };

  return (
  <section id="how-work-section" className="section-bg py-20 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Proceso sencillo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Empieza en minutos con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">TToca</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            TToca está diseñado para que cualquier negocio implemente un sistema de turnos virtual sin complicaciones.
          </p>
        </div>

        {/* === MOBILE: Carrusel Swipeable === */}
        <div
          className="lg:hidden overflow-hidden rounded-2xl"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {pasos.map((paso, index) => (
              <div key={index} className="min-w-full px-1">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${paso.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${paso.color} flex items-center justify-center shadow-md mr-4`}
                      >
                        {paso.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">{paso.titulo}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{paso.descripcion}</p>
                    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <img
                        src={paso.imagen}
                        alt={paso.titulo}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {pasos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* === DESKTOP: Timeline interactivo === */}
        <div className="hidden lg:block">
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 -translate-y-1/2 z-10 transition-all duration-500"
              style={{ width: `${((activeStep + 1) / pasos.length) * 100}%` }}
            ></div>

            {pasos.map((paso, index) => (
              <div
                key={index}
                className="z-20 flex flex-col items-center cursor-pointer"
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all duration-300 ${
                    index <= activeStep
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    index <= activeStep ? "text-blue-700" : "text-gray-400"
                  }`}
                >
                  {paso.titulo}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${pasos[activeStep].color}`}></div>
            <div className="grid grid-cols-2 gap-8 p-8">
              <div className="flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${pasos[activeStep].color} flex items-center justify-center shadow-md mr-4`}
                  >
                    {pasos[activeStep].icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{pasos[activeStep].titulo}</h3>
                </div>
                <p className="text-gray-600 text-lg mb-8">{pasos[activeStep].descripcion}</p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveStep(activeStep === 0 ? pasos.length - 1 : activeStep - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setActiveStep(activeStep === pasos.length - 1 ? 0 : activeStep + 1)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center"
                  >
                    Siguiente
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-4">
                <img
                  src={pasos[activeStep].imagen}
                  alt={pasos[activeStep].titulo}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWork;

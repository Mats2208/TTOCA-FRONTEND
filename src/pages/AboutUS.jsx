"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Heart, Rocket, Home, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  const teamMembers = [
    {
      name: "Maria Fernanda Sanchez",
      role: "Queue Backend Developer",
      description: "Especialista en crear enlaces de datos Queue.",
      skills: ["Python", "C++"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      icon: "💜",
      imageUrl: "/assets/team/maria.jpg",
    },
    {
      name: "Mateo Andres Soto",
      role: "Full Stack Developer",
      description: "Desarrollador versátil con enfoque en soluciones completas y arquitectura escalable.",
      skills: ["JavaScript", "React", "Tailwind CSS"],
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50 border-indigo-200",
      icon: "⚡",
      imageUrl: "/assets/team/mateo.jpg",
    },
    {
      name: "Carlos Moises Zambrana",
      role: "Backend Developer",
      description: "Experto en desarrollo de APIs robustas y sistemas de gestión de datos eficientes.",
      skills: ["Python", "API Development", "System Architecture"],
      color: "from-gray-600 to-blue-600",
      bgColor: "bg-gray-50 border-gray-200",
      icon: "🚀",
      imageUrl: "/assets/team/carlos.jpg",
    },
    {
      name: "Flavia Lozada Rueda",
      role: "Creative Leader & Designer",
      description: "Líder creativa enfocada en diseño innovador y experiencias digitales memorables.",
      skills: ["Design Thinking", "Creative Direction", "Python"],
      color: "from-purple-500 to-blue-600",
      bgColor: "bg-purple-50 border-purple-200",
      icon: "✨",
      imageUrl: "/assets/team/flavia.jpg",
    },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200/40 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-purple-200/30 rounded-full blur-md"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-300/20 rounded-full blur-sm animate-pulse"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl shadow-lg border border-gray-200 flex items-center gap-1 sm:gap-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <Home className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-medium text-sm sm:text-base">Inicio</span>
        </Link>
      </div>      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-20">
        {/* Additional background elements for Hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-indigo-300/20 to-transparent rounded-full blur-3xl"></div>
          
          {/* Floating code elements */}
          <div className="absolute top-10 left-1/4 text-blue-200/10 text-6xl font-mono rotate-12 select-none">&lt;/&gt;</div>
          <div className="absolute bottom-20 right-1/4 text-indigo-200/10 text-4xl font-mono -rotate-12 select-none">{ }</div>
          <div className="absolute top-1/2 left-10 text-purple-200/10 text-8xl font-mono rotate-45 select-none">💻</div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className={`text-center transform transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              TECNOUPSA 2025 - Feria Tecnológica UPSA
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-4 sm:mb-6 px-2">
              Conoce a nuestro{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">equipo</span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Somos un equipo de estudiantes apasionados de la Universidad Privada de Santa Cruz, participando en{" "}
              <strong>TECNOUPSA 2025</strong> con nuestra innovadora solución para la gestión digital de turnos y filas
              virtuales.
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
              <div className="bg-white rounded-full px-3 py-2 sm:px-6 sm:py-3 shadow-lg border border-blue-200">
                <span className="text-blue-700 font-semibold text-xs sm:text-sm">🎓 Ingeniería en Sistemas</span>
              </div>
              <div className="bg-white rounded-full px-3 py-2 sm:px-6 sm:py-3 shadow-lg border border-blue-200">
                <span className="text-blue-700 font-semibold text-xs sm:text-sm">🏆 TECNOUPSA 2025</span>
              </div>
              <div className="bg-white rounded-full px-3 py-2 sm:px-6 sm:py-3 shadow-lg border border-blue-200">
                <span className="text-blue-700 font-semibold text-xs sm:text-sm">💡 Innovación Digital</span>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Story Section */}
      <section
        className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative transform transition-all duration-700 delay-200 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Background decorative elements for Story Section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-100/40 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-100/20 rounded-full blur-xl"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-2xl -z-10"></div>
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10"></div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 sm:p-8 text-white">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />
                <h2 className="text-2xl sm:text-3xl font-bold">Nuestra Historia</h2>
              </div>
              <p className="text-blue-100 text-base sm:text-lg">
                Representando con orgullo a la UPSA en la feria tecnológica más importante
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                Somos estudiantes de <span className="font-semibold text-blue-600">Ingeniería en Sistemas</span> de la
                Universidad Privada de Santa Cruz (UPSA), unidos por la pasión de crear tecnología que marque la
                diferencia en nuestra comunidad.
              </p>

              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                En <span className="font-bold text-blue-600">TECNOUPSA 2025</span>, presentamos{" "}
                <span className="font-semibold text-gray-800">Ttoca</span>, nuestra propuesta innovadora para
                digitalizar la gestión de turnos y eliminar las filas tradicionales mediante tecnología web accesible y
                fácil de usar.
              </p>

              <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Nuestra Misión</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Revolucionar la experiencia de espera mediante{" "}
                  <span className="font-semibold">tecnología accesible e innovadora</span>. Creemos en crear soluciones
                  que simplifiquen la vida de las personas y optimicen los procesos empresariales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Team Section */}
      <section
        className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 relative transform transition-all duration-700 delay-400 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Background decorative elements for Team Section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-indigo-200/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-purple-200/25 rounded-full blur-xl animate-bounce"></div>
          
          {/* Tech icons floating */}
          <div className="absolute top-20 left-1/3 text-blue-100 text-4xl rotate-12 select-none animate-pulse">⚛️</div>
          <div className="absolute bottom-40 right-1/4 text-indigo-100 text-3xl -rotate-12 select-none">🚀</div>
          <div className="absolute top-2/3 left-10 text-purple-100 text-5xl rotate-45 select-none">✨</div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Conoce al{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Equipo</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Cuatro mentes brillantes trabajando juntas para crear el futuro de la gestión de turnos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`group transform transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div
                  className={`bg-white rounded-2xl shadow-lg border-2 ${member.bgColor} overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative h-full flex flex-col`}
                >
                  {/* Background decorative element */}
                  <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-blue-100 rounded-full opacity-20 blur-xl -z-10"></div>

                  {/* Imagen de perfil */}
                  <div className="relative w-full h-48 sm:h-40 lg:h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-80`}></div>
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback en caso de que la imagen no cargue
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback cuando no hay imagen */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} hidden items-center justify-center`}>
                      <span className="text-6xl text-white opacity-80">{member.icon}</span>
                    </div>
                    {/* Overlay con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    {/* Nombre sobre la imagen */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg sm:text-base lg:text-lg leading-tight mb-1 drop-shadow-lg">
                        {member.name}
                      </h3>
                      <p className="text-white/90 font-medium text-sm drop-shadow-lg">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <p className="text-gray-700 leading-relaxed mb-4 text-sm flex-1">
                      {member.description}
                    </p>

                    {/* Skills */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Especialidades:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Call to Action */}
      <Footer />
    </div>
  )
}

export default AboutUs

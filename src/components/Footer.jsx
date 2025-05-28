"use client"

import { Facebook, Twitter, Instagram, Mail, ChevronDown } from "lucide-react"
import { useState } from "react"

const Footer = () => {
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null)
    } else {
      setOpenSection(section)
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Marca - siempre visible */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">Ttoca</h2>
          <p className="text-sm text-gray-400 max-w-md">
            Soluciones SaaS para gestionar filas y turnos virtuales en minutos. Sin instalaciones, sin complicaciones.
          </p>
        </div>

        {/* Secciones colapsables en móvil, grid en desktop */}
        <div className="md:grid md:grid-cols-3 md:gap-8 border-t border-gray-800 md:border-t-0 pt-2 md:pt-0">
          {/* Enlaces */}
          <div className="py-3 border-b border-gray-800 md:border-b-0 md:py-0">
            <button
              className="flex justify-between items-center w-full text-left md:hidden"
              onClick={() => toggleSection("enlaces")}
              aria-expanded={openSection === "enlaces"}
            >
              <h3 className="text-lg font-semibold text-white">Enlaces útiles</h3>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${openSection === "enlaces" ? "transform rotate-180" : ""}`}
              />
            </button>
            <h3 className="text-lg font-semibold text-white mb-3 hidden md:block">Enlaces útiles</h3>
            <ul className={`space-y-3 text-sm mt-3 ${openSection === "enlaces" ? "block" : "hidden md:block"}`}>
              <li>
                <a href="/" className="hover:text-white transition block py-1">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition block py-1">
                  Precios
                </a>
              </li>
              <li>
                <a href="/servicios" className="hover:text-white transition block py-1">
                  Contacto
                </a>
              </li>
              <li>
                <a href="/terminos" className="hover:text-white transition block py-1">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="py-3 border-b border-gray-800 md:border-b-0 md:py-0">
            <button
              className="flex justify-between items-center w-full text-left md:hidden"
              onClick={() => toggleSection("soporte")}
              aria-expanded={openSection === "soporte"}
            >
              <h3 className="text-lg font-semibold text-white">Soporte</h3>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${openSection === "soporte" ? "transform rotate-180" : ""}`}
              />
            </button>
            <h3 className="text-lg font-semibold text-white mb-3 hidden md:block">Soporte</h3>
            <ul className={`space-y-3 text-sm mt-3 ${openSection === "soporte" ? "block" : "hidden md:block"}`}>
              <li className="py-1">
                Email:{" "}
                <a href="mailto:soporte@ttoca.com" className="hover:text-white transition">
                  ttocaproyect@gmail.com
                </a>
              </li>
              <li>
                <a href="/servicios" className="hover:text-white transition block py-1">
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="/servicios" className="hover:text-white transition block py-1">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Redes */}
          <div className="py-3 md:py-0">
            <button
              className="flex justify-between items-center w-full text-left md:hidden"
              onClick={() => toggleSection("redes")}
              aria-expanded={openSection === "redes"}
            >
              <h3 className="text-lg font-semibold text-white">Síguenos</h3>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${openSection === "redes" ? "transform rotate-180" : ""}`}
              />
            </button>
            <h3 className="text-lg font-semibold text-white mb-3 hidden md:block">Síguenos</h3>
            <div className={`mt-3 ${openSection === "redes" ? "block" : "hidden md:block"}`}>
              <div className="grid grid-cols-4 gap-2 sm:flex sm:space-x-4 max-w-xs">
                <a
                  href="#"
                  className="hover:text-white transition bg-gray-800 hover:bg-gray-700 p-3 rounded-full flex items-center justify-center"
                >
                  <Facebook size={20} />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="#"
                  className="hover:text-white transition bg-gray-800 hover:bg-gray-700 p-3 rounded-full flex items-center justify-center"
                >
                  <Twitter size={20} />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="#"
                  className="hover:text-white transition bg-gray-800 hover:bg-gray-700 p-3 rounded-full flex items-center justify-center"
                >
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="mailto:soporte@ttoca.com"
                  className="hover:text-white transition bg-gray-800 hover:bg-gray-700 p-3 rounded-full flex items-center justify-center"
                >
                  <Mail size={20} />
                  <span className="sr-only">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          TECNOUPSA - {new Date().getFullYear()}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer

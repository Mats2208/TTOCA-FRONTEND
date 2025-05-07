"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/servicios" },
    { name: "Precios", href: "/precios" },
    { name: "Contacto", href: "/contacto" },
  ]

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cerrar el menú cuando se cambia el tamaño de la ventana a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg py-2" : "bg-white shadow-md py-3"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo + Nombre */}
        <a href="/" className="flex items-center space-x-3 group">
          <div className="relative h-10 w-11 overflow-hidden">
            <img
              src="/src/assets/TToca_Logo.png"
              alt="Logo TToca"
              className="h-10 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            TToca
          </span>
        </a>

        {/* Navegación en pantallas grandes */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-600 font-medium hover:text-blue-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Botón de Login */}
        <div className="hidden md:block">
          <a
            href="/login"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-in-out"
          >
            Iniciar sesión
          </a>
        </div>

        {/* Menú Hamburguesa (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div
        className={`absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg transform transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 py-4 space-y-5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-gray-700 hover:text-blue-600 font-medium py-2 border-b border-gray-100 last:border-0 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/login"
            className="block text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header

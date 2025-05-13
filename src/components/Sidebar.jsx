"use client"

import { useState, useEffect } from "react"
import { Building2, LayoutDashboard, BarChart3, Settings, Settings2, Menu, X, LogOut } from "lucide-react"

export default function Sidebar({ proyecto, setVista, vistaActiva }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

    const handleLogout = () => {
    // Limpiar sesión actual y datos de empresas
    localStorage.removeItem("ttoca_session")
    // Si usás un backend, aquí deberías invalidar el token en el servidor
    window.location.href = "/login"
    }

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar")
      if (isMobile && isOpen && sidebar && !sidebar.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile, isOpen])

  const opciones = [
    { id: "cola", icon: <LayoutDashboard size={20} />, label: "Cola" },
    { id: "estadisticas", icon: <BarChart3 size={20} />, label: "Estadísticas" },
    { id: "configuracion", icon: <Settings size={20} />, label: "Configuración" },
    { id: "Administrar_Cola", icon: <Settings2 size={20} />, label: "Administracion de Cola" },
  ]

  const handleNavClick = (id) => {
    setVista(id)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-md shadow-md text-gray-700 hover:bg-gray-50"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          fixed lg:sticky top-0 z-20 h-screen bg-white shadow-lg border-r border-gray-100
          transition-all duration-300 ease-in-out
          ${isMobile ? (isOpen ? "left-0" : "-left-72") : "left-0"}
          w-64 lg:w-72
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-md">
                <Building2 size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-800 truncate">{proyecto?.nombre || "Dashboard"}</h1>
                <p className="text-xs text-gray-500 truncate">{proyecto?.titular || "Gestión empresarial"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {opciones.map((op) => (
                <button
                  key={op.id}
                  onClick={() => handleNavClick(op.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    text-sm font-medium
                    ${vistaActiva === op.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}
                  `}
                >
                  <span className={`${vistaActiva === op.id ? "text-blue-600" : "text-gray-500"}`}>{op.icon}</span>
                  {op.label}
                </button>
              ))}
            </div>
          </nav>          {/* Footer */}
          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <LogOut size={16} className="flex-shrink-0" />
              <span>Cerrar sesión</span>
            </button>
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-blue-700 mb-1">¿Necesitas ayuda?</h3>
              <p className="text-xs text-blue-600/80 mb-3">Consulta nuestra guía de uso o contacta con soporte.</p>
              <button className="flex items-center justify-center w-full bg-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 text-blue-600 hover:text-white py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-300">
                Ver documentación
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

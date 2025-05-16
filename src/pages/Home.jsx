"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Plus, ArrowRight, Calendar, Users, BarChart3, Clock } from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("ttoca_session"))
    if (!session) {
      navigate("/login")
    } else {
    fetch(`http://localhost:5000/api/usuarios/${session.correo}/proyectos`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener las empresas")
        return res.json()
      })
      .then(data => {
        setProyectos(data.empresas || [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error al cargar proyectos:", err)
        setProyectos([])
        setLoading(false)
      })
    }
  }, [navigate])

  const irADashboard = (id) => {
    navigate(`/dashboard/${id}`)
  }

  const irACrearProyecto = () => {
    navigate("/crearproyecto")
  }
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Building2 size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <p className="text-gray-600 font-medium mt-6 animate-pulse">Preparando tu panel empresarial...</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-10">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-3xl opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm text-sm mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                Dashboard en vivo
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Bienvenido a tu Panel Empresarial
              </h1>
              <p className="text-blue-100 max-w-2xl">
                Administra tus colas de servicio, visualiza estadísticas y optimiza la atención a tus clientes.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Building2 size={20} className="mr-2 text-blue-600" />
                Tus Empresas
              </h2>
              <p className="text-gray-500 ml-7">Gestiona todos tus negocios desde un solo lugar</p>
            </div>
            
            {proyectos.length > 0 && (
              <button
                onClick={irACrearProyecto}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-blue-200 hover:shadow-md"
              >
                <Plus size={18} className="mr-2" />
                Nueva Empresa
              </button>
            )}
          </div>
        </header>

        {proyectos.length === 0 ? (
          <EmptyState onCreateProject={irACrearProyecto} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectos.map((proyecto) => (
              <ProjectCard key={proyecto.id} proyecto={proyecto} onClick={() => irADashboard(proyecto.id)} />
            ))}
            <AddProjectCard onClick={irACrearProyecto} />
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ proyecto, onClick }) {
  // Generamos algunos stats aleatorios para demo
  //Cambiar luego con los datos reales
  const stats = [
    {icon: <Users size={14} className="text-blue-500" />, value: Math.floor(Math.random() * 50) + 10 },
    {icon: <Calendar size={14} className="text-green-500" />, value: Math.floor(Math.random() * 20) + 5 },
    {icon: <Clock size={14} className="text-amber-500" />, value: Math.floor(Math.random() * 15) + "min" }
  ];
  
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-200 hover:border-blue-200 transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start space-x-4">
          <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
            {proyecto.logo ? (
              <img
                src={proyecto.logo || "/placeholder.svg"}
                alt={proyecto.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
                <Building2 size={28} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg text-gray-800 truncate group-hover:text-blue-600 transition-colors">
              {proyecto.nombre}
            </h2>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{proyecto.titular || "Gestión de colas empresariales"}</p>
            
            <div className="flex items-center gap-4 mt-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 px-2 py-0.5 rounded-md">
                  {stat.icon}
                  <span>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
          <span className="text-xs font-medium text-gray-500">Activo</span>
        </div>
        
        <button className="text-sm px-4 py-1.5 rounded-lg font-medium flex items-center text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
          Gestionar
          <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

function AddProjectCard({ onClick }) {
  return (
    <div
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl overflow-hidden border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center p-8 h-full"
      onClick={onClick}
    >
      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-4 shadow-md">
        <Plus size={28} />
      </div>
      <h3 className="font-semibold text-gray-800 text-center">Agregar Nueva Empresa</h3>
      <p className="text-sm text-gray-500 text-center mt-2 max-w-xs">
        Configura una nueva cola virtual para tu negocio en minutos
      </p>
    </div>
  )
}

function EmptyState({ onCreateProject }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-white border border-gray-200 shadow-lg">
      <div className="relative mb-8">
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
          <Building2 size={42} />
        </div>
        <div className="absolute -right-2 -bottom-2 h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md border-4 border-white">
          <Plus size={24} />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Comienza tu Gestión Empresarial</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Crea tu primera cola empresarial y comienza a optimizar la atención de tus clientes con un sistema digital eficiente.
      </p>
      
      <button
        onClick={onCreateProject}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center transition-all shadow-md hover:shadow-lg"
      >
        <Plus size={20} className="mr-2" />
        Crear Mi Primera Empresa
      </button>
      
      <div className="mt-8 pt-6 border-t border-gray-100 w-full max-w-md">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <BarChart3 size={20} className="mx-auto text-blue-500 mb-2" />
            <p className="text-xs text-gray-500">Estadísticas</p>
          </div>
          <div className="text-center">
            <Users size={20} className="mx-auto text-blue-500 mb-2" />
            <p className="text-xs text-gray-500">Clientes</p>
          </div>
          <div className="text-center">
            <Calendar size={20} className="mx-auto text-blue-500 mb-2" />
            <p className="text-xs text-gray-500">Agenda</p>
          </div>
        </div>
      </div>
    </div>
  )
}

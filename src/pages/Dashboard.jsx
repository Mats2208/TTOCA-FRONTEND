// src/pages/Dashboard.jsx
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import EmpresaHeader from "../components/EmpresaHeader"
import ColaPanel from "../components/panels/ColaPanel"
import EstadisticasPanel from "../components/panels/EstadisticasPanel"
import ConfiguracionPanel from "../components/panels/ConfiguracionPanel"

const Dashboard = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proyecto, setProyecto] = useState(null)
  const [vista, setVista] = useState("cola")

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("ttoca_session"))
    if (!session) {
      return navigate("/login")
    }

    const key = `ttoca_proyectos_${session.correo}`
    const proyectos = JSON.parse(localStorage.getItem(key)) || []
    const proyectoEncontrado = proyectos.find(p => p.id === id)

    if (!proyectoEncontrado) {
      return navigate("/home")
    }

    setProyecto(proyectoEncontrado)
  }, [id, navigate])

  if (!proyecto) {
    return <div className="p-10">Cargando proyecto...</div>
  }

  const renderVista = () => {
    switch (vista) {
      case "cola":
        return <ColaPanel proyecto={proyecto} />
      case "estadisticas":
        return <EstadisticasPanel proyecto={proyecto} />
      case "configuracion":
        return <ConfiguracionPanel proyecto={proyecto} setProyecto={setProyecto} />
      default:
        return <ColaPanel proyecto={proyecto} />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar proyecto={proyecto} setVista={setVista} vistaActiva={vista} />
      <div className="flex-1 p-6">
        <EmpresaHeader proyecto={proyecto} />
        <div className="mt-6">{renderVista()}</div>
      </div>
    </div>
  )
}

export default Dashboard

// src/pages/Dashboard.jsx
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import EmpresaHeader from "../components/EmpresaHeader"
import ColaPanel from "../components/panels/ColaPanel"
import EstadisticasPanel from "../components/panels/EstadisticasPanel"
import ConfiguracionPanel from "../components/panels/ConfiguracionPanel"
import SettingsQueue from "../components/panels/SettingQueue"
const API_URL = import.meta.env.VITE_URL

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

    fetch(`${API_URL}/api/usuarios/${encodeURIComponent(session.correo)}/proyectos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Proyecto no encontrado")
        return res.json()
      })
      .then((data) => {
        setProyecto(data.empresa)
      })
      .catch((err) => {
        console.error("Error al cargar el proyecto:", err)
        navigate("/home")
      })
  }, [id, navigate])

  if (!proyecto) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Cargando proyecto...
      </div>
    )
  }

  const renderVista = () => {
    switch (vista) {
      case "cola":
        return <ColaPanel proyecto={proyecto} />
      case "estadisticas":
        return <EstadisticasPanel proyecto={proyecto} />
      case "Administrar_Cola":
        return <SettingsQueue proyecto={proyecto} />
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

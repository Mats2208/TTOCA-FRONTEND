import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import HeaderDashboard from "../components/HeaderDashboard"

const Dashboard = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proyecto, setProyecto] = useState(null)

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("ttoca_session"))
    if (!session) {
      return navigate("/login")
    }

    const key = `ttoca_proyectos_${session.correo}`
    const proyectos = JSON.parse(localStorage.getItem(key)) || []
    const proyectoEncontrado = proyectos.find(p => p.id === id)

    if (!proyectoEncontrado) {
      return navigate("/home") // Proyecto no válido o no existe
    }

    setProyecto(proyectoEncontrado)
  }, [id, navigate])

  if (!proyecto) {
    return <div className="p-10">Cargando proyecto...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />

      <div className="p-8">
        <div className="flex items-center gap-4 mb-6">
          {proyecto.logo && (
            <img src={proyecto.logo} alt="logo" className="h-12 w-12 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{proyecto.nombre}</h1>
            <p className="text-gray-600 text-sm">Titular: {proyecto.titular}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Cola Virtual</h2>
            <p className="text-gray-600">Estado: Inactiva</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Iniciar Cola
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Horario</h2>
            <p className="text-gray-600">{proyecto.horario || "No definido"}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Estadísticas</h2>
            <p className="text-gray-600">Sin datos por el momento</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

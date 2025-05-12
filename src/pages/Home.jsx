import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const Home = () => {
  const navigate = useNavigate()
  const [proyectos, setProyectos] = useState([])

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("ttoca_session"))
    if (!session) {
    navigate("/login")
    } else {
    const key = "ttoca_proyectos_" + session.correo
    const datos = JSON.parse(localStorage.getItem(key)) || []
    setProyectos(datos)
    }
  }, [])

  const irADashboard = (id) => {
    navigate(`/dashboard/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Bienvenido a tu espacio de gestión</h1>

      {proyectos.length === 0 ? (
        <div className="text-center mt-20">
          <p className="mb-4">No tienes ningún proyecto todavía.</p>
          <button
            onClick={() => navigate("/crearproyecto")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Crear Cola Empresarial
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {proyectos.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
              onClick={() => irADashboard(p.id)}
            >
              <img src={p.logo} alt={p.nombre} className="h-16 w-16 object-cover rounded-full mb-2" />
              <h2 className="font-semibold">{p.nombre}</h2>
              <p className="text-sm text-gray-500">{p.titular}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home

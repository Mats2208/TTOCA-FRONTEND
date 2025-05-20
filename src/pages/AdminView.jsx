import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_URL

export default function AdminView() {
  const { empresaId, colaId } = useParams()
  const [turnos, setTurnos] = useState([])

  const fetchTurnos = () => {
    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaId}`)
      .then((res) => res.json())
      .then((data) => setTurnos(data.turnos || []))
      .catch((err) => console.error("Error al cargar turnos", err))
  }

  useEffect(() => {
    fetchTurnos()
    const intervalo = setInterval(fetchTurnos, 5000)
    return () => clearInterval(intervalo)
  }, [])

  const llamarSiguiente = () => {
    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaId}/siguiente`, {
      method: "POST",
    })
      .then(() => fetchTurnos())
      .catch((err) => console.error("Error al llamar siguiente", err))
  }

  return (
    <div className="h-screen w-screen bg-white p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-violet-700 mb-6">Vista Administrativa</h2>

      <button
        onClick={llamarSiguiente}
        disabled={turnos.length === 0}
        className={`mb-6 px-6 py-3 rounded-lg text-white font-semibold transition-all ${
          turnos.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Llamar Siguiente
      </button>

      <div className="w-full max-w-md space-y-3">
        {turnos.length > 0 ? (
          turnos.map((cliente, idx) => (
            <div
              key={cliente.id}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-center shadow-sm"
            >
              <span className="font-semibold text-gray-800">{cliente.nombre}</span>
              <span className="text-sm text-gray-500">#{idx + 1}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No hay clientes en la cola</p>
        )}
      </div>
    </div>
  )
}

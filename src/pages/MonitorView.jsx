import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_URL

export default function MonitorView() {
  const { empresaId, colaId } = useParams()
  const [turnoActual, setTurnoActual] = useState(null)

  useEffect(() => {
    const fetchTurnoActual = () => {
      fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaId}/turno-actual`)
        .then((res) => res.json())
        .then((data) => setTurnoActual(data))
        .catch((err) => console.error("Error al obtener turno actual", err))
    }

    fetchTurnoActual()
    const interval = setInterval(fetchTurnoActual, 5000) // actualizar cada 5 segundos
    return () => clearInterval(interval)
  }, [empresaId, colaId])

  return (
    <div className="h-screen w-screen bg-violet-950 text-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Turno Actual</h1>
      {turnoActual ? (
        <div className="bg-white text-violet-950 p-8 rounded-2xl shadow-lg">
          <p className="text-6xl font-extrabold mb-2">{turnoActual.numero}</p>
          <p className="text-2xl font-semibold">{turnoActual.nombre}</p>
        </div>
      ) : (
        <p className="text-2xl text-gray-300">Esperando llamado...</p>
      )}
    </div>
  )
}

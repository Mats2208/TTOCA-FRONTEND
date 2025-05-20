import { useParams } from "react-router-dom"
import { useState } from "react"

const API_URL = import.meta.env.VITE_URL

export default function EntradaView() {
  const { empresaId, colaId } = useParams()
  const [nombre, setNombre] = useState("")
  const [mensaje, setMensaje] = useState("")

  const obtenerTurno = () => {
    if (!nombre.trim()) return

    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    })
      .then((res) => res.json())
      .then(() => {
        setMensaje(`¡Turno generado para ${nombre}!`)
        setNombre("")
      })
      .catch((err) => {
        console.error("Error al registrar cliente", err)
        setMensaje("Hubo un error al generar el turno")
      })
  }

  return (
    <div className="h-screen w-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Solicitar Turno</h2>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingrese su nombre"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={obtenerTurno}
          className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 transition-colors"
        >
          Obtener Turno
        </button>
        {mensaje && (
          <p className="text-center text-green-600 font-medium mt-4">{mensaje}</p>
        )}
      </div>
    </div>
  )
}

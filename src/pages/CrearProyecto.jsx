import { useState } from "react"
import { useNavigate } from "react-router-dom"

const CrearProyecto = () => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [titular, setTitular] = useState("")
  const [logo, setLogo] = useState("")
  const [horario, setHorario] = useState("")

    const handleCrear = () => {
    const session = JSON.parse(localStorage.getItem("ttoca_session"))
    if (!session) return navigate("/login")

    const key = "ttoca_proyectos_" + session.correo
    const proyectos = JSON.parse(localStorage.getItem(key)) || []

    const nuevo = {
        id: Date.now().toString(),
        nombre,
        titular,
        logo,
        horario,
    }

    proyectos.push(nuevo)
    localStorage.setItem(key, JSON.stringify(proyectos))
    navigate("/home")
    }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Crear nuevo proyecto</h1>

      <div className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Nombre de la empresa"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Titular del negocio"
          value={titular}
          onChange={(e) => setTitular(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Logo (URL)"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Horario de atención"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleCrear}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Crear Proyecto
        </button>
      </div>
    </div>
  )
}

export default CrearProyecto

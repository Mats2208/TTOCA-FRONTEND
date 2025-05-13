import { useState } from "react"

export default function SettingsQueue({ proyecto }) {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState(false)
  const [tiempoEstimado, setTiempoEstimado] = useState(5)

  const agregarCategoria = () => {
    const nueva = {
      id: crypto.randomUUID(),
      nombre,
      descripcion,
      prioridad,
      tiempoEstimado
    }
    setCategorias([...categorias, nueva])
    setNombre("")
    setDescripcion("")
    setPrioridad(false)
    setTiempoEstimado(5)
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold">Ajustes de la Cola</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de categoría</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiempo estimado (minutos)</label>
          <input
            type="number"
            value={tiempoEstimado}
            onChange={(e) => setTiempoEstimado(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            checked={prioridad}
            onChange={(e) => setPrioridad(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Prioritario</span>
        </div>
      </div>

      <button
        onClick={agregarCategoria}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Agregar categoría
      </button>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Categorías actuales</h3>
        {categorias.length === 0 ? (
          <p className="text-gray-500">No hay categorías registradas aún.</p>
        ) : (
          <ul className="space-y-2">
            {categorias.map((cat) => (
              <li key={cat.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{cat.nombre}</p>
                    <p className="text-sm text-gray-500">{cat.descripcion}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {cat.prioridad && <span className="text-red-500 font-semibold">Prioritario</span>}<br />
                    {cat.tiempoEstimado} min
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
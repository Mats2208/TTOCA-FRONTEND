// src/components/panels/ColaPanel.jsx
"use client"

import { useState } from "react"
import { Play, Pause, Users, Clock, RefreshCw, QrCode } from "lucide-react"

export default function ColaPanel({ proyecto }) {
  const [colaActiva, setColaActiva] = useState(false)
  const [clientes, setClientes] = useState([])
  const [nombreCliente, setNombreCliente] = useState("")

  const toggleCola = () => {
    setColaActiva(!colaActiva)
    if (!colaActiva) {
      // Al activar la cola, se reinicia con algunos clientes falsos
      setClientes([
        { id: crypto.randomUUID(), nombre: "Juan Pérez" },
        { id: crypto.randomUUID(), nombre: "María López" }
      ])
    } else {
      setClientes([])
    }
  }

  const agregarCliente = () => {
    if (nombreCliente.trim()) {
      setClientes([...clientes, { id: crypto.randomUUID(), nombre: nombreCliente }])
      setNombreCliente("")
    }
  }

  const llamarSiguiente = () => {
    if (clientes.length > 0) {
      setClientes(clientes.slice(1))
    }
  }

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Cola Virtual</h2>
          <div
            className={`
            px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
            ${colaActiva ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}
          `}
          >
            <span className={`h-2 w-2 rounded-full ${colaActiva ? "bg-green-500" : "bg-gray-400"}`}></span>
            {colaActiva ? "Activa" : "Inactiva"}
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md text-blue-600">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Clientes en espera</p>
                <p className="text-lg font-semibold text-gray-800">{clientes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md text-blue-600">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tiempo estimado</p>
                <p className="text-lg font-semibold text-gray-800">
                  {clientes.length > 0 ? `${clientes.length * 5} min` : "0 min"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario para agregar clientes manualmente */}
        {colaActiva && (
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Nombre del cliente"
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            <button
              onClick={agregarCliente}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={toggleCola}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors
              ${
                colaActiva
                  ? "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            {colaActiva ? (
              <>
                <Pause size={18} />
                Pausar Cola
              </>
            ) : (
              <>
                <Play size={18} />
                Iniciar Cola
              </>
            )}
          </button>

          {colaActiva && (
            <button
              onClick={llamarSiguiente}
              disabled={clientes.length === 0}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium
                ${
                  clientes.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }
              `}
            >
              <RefreshCw size={18} />
              Llamar siguiente
            </button>
          )}
        </div>

        {/* QR Code Section */}
        {colaActiva && (
          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
            <div className="mx-auto w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
              <QrCode size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-1">Código QR para clientes</h3>
            <p className="text-xs text-gray-500 mb-3">
              Comparte este código para que tus clientes se unan a la cola virtual
            </p>
            <button className="text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-1.5 px-3 rounded-md transition-colors">
              Generar código QR
            </button>
          </div>
        )}

        {/* Visualización de la cola */}
        {colaActiva && clientes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Clientes en la cola</h3>
            <ul className="divide-y divide-gray-200">
              {clientes.map((cliente, index) => (
                <li key={cliente.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    <span className="font-medium text-gray-800">{cliente.nombre}</span>
                  </div>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

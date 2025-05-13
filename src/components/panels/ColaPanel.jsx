"use client"

import { useState } from "react"
import { Play, Pause, Users, Clock, RefreshCw, QrCode } from "lucide-react"

export default function ColaPanel({ proyecto }) {
  const [colaActiva, setColaActiva] = useState(false)
  const [clientesEnEspera, setClientesEnEspera] = useState(0)

  const toggleCola = () => {
    setColaActiva(!colaActiva)
    // Si activamos la cola, simulamos algunos clientes
    if (!colaActiva) {
      setClientesEnEspera(Math.floor(Math.random() * 5))
    } else {
      setClientesEnEspera(0)
    }
  }

  const llamarSiguiente = () => {
    if (clientesEnEspera > 0) {
      setClientesEnEspera(clientesEnEspera - 1)
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
                <p className="text-lg font-semibold text-gray-800">{clientesEnEspera}</p>
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
                  {clientesEnEspera > 0 ? `${clientesEnEspera * 5} min` : "0 min"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
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
              disabled={clientesEnEspera === 0}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium
                ${
                  clientesEnEspera === 0
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
      </div>
    </div>
  )
}

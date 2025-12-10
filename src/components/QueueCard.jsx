import React, { useState } from "react";
import { Clock, Users, ChevronRight } from "lucide-react";

export default function QueueCard({ cola, turnos, onLlamarSiguiente }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleLlamarSiguiente = () => {
    if (turnos.length === 0) return;
    setIsAnimating(true);
    
    // Call the API endpoint
    onLlamarSiguiente(cola.id);
    
    // Reset animation after 1 second
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-primary-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{cola.nombre}</h3>
            <div className="flex items-center mt-2">
              <div className="bg-white p-1.5 rounded-lg mr-2 shadow-soft">
                <Users className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {turnos.length} {turnos.length === 1 ? "cliente" : "clientes"} en espera
              </span>
            </div>
          </div>

          <QueueStatusBadge count={turnos.length} />
        </div>
      </div>

      {/* Client list */}
      <div className="p-6">
        <div className="space-y-2 mb-5 max-h-80 overflow-y-auto">
          {turnos.length > 0 ? (
            turnos.map((cliente, idx) => (
              <ClientRow
                key={cliente.id}
                cliente={cliente}
                position={idx + 1}
                isFirst={idx === 0}
                isAnimating={isAnimating && idx === 0}
              />
            ))
          ) : (
            <EmptyQueueMessage />
          )}
        </div>

        {/* Action button */}
        <div className="mt-4">
          <button
            onClick={handleLlamarSiguiente}
            disabled={turnos.length === 0}
            className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 ${
              turnos.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-success-600 to-success-700 hover:shadow-card text-white shadow-soft hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {turnos.length === 0 ? (
              "Cola vacía"
            ) : (
              <>
                Llamar siguiente cliente
                <ChevronRight className={`ml-2 w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function QueueStatusBadge({ count }) {
  if (count === 0) {
    return (
      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold shadow-soft">
        Vacía
      </span>
    );
  } else if (count < 5) {
    return (
      <span className="px-3 py-1.5 bg-gradient-to-r from-success-100 to-success-200 text-success-700 rounded-full text-xs font-semibold shadow-soft border border-success-200">
        Fluida
      </span>
    );
  } else if (count < 10) {
    return (
      <span className="px-3 py-1.5 bg-gradient-to-r from-warning-100 to-warning-200 text-warning-700 rounded-full text-xs font-semibold shadow-soft border border-warning-200">
        Moderada
      </span>
    );
  } else {
    return (
      <span className="px-3 py-1.5 bg-gradient-to-r from-danger-100 to-danger-200 text-danger-700 rounded-full text-xs font-semibold shadow-soft border border-danger-200">
        Alta demanda
      </span>
    );
  }
}

function ClientRow({ cliente, position, isFirst, isAnimating }) {
  return (
    <div
      className={`p-3.5 rounded-xl flex justify-between items-center transition-all duration-300 ${
        isFirst
          ? `bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 ${isAnimating ? 'animate-pulse shadow-card' : 'shadow-soft'}`
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 text-xs font-bold transition-transform duration-200 ${
          isFirst ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-soft' : 'bg-gray-200 text-gray-700'
        }`}>
          {position}
        </div>
        <span className={`font-semibold ${isFirst ? 'text-primary-800' : 'text-gray-800'}`}>
          {cliente.nombre}
        </span>
      </div>

      {isFirst && (
        <div className="flex items-center text-primary-700 text-xs font-bold bg-white px-2.5 py-1.5 rounded-lg shadow-soft">
          <Clock className="w-3.5 h-3.5 mr-1" />
          Siguiente
        </div>
      )}
    </div>
  );
}

function EmptyQueueMessage() {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 text-center">
      <Users className="w-10 h-10 mx-auto mb-3 text-gray-400" />
      <p className="text-gray-600 text-sm font-medium">
        No hay clientes en espera en esta cola
      </p>
    </div>
  );
}
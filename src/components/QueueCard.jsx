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
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{cola.nombre}</h3>
            <div className="flex items-center mt-1">
              <Users className="w-4 h-4 text-blue-500 mr-1.5" />
              <span className="text-sm text-gray-500">
                {turnos.length} {turnos.length === 1 ? "cliente" : "clientes"} en espera
              </span>
            </div>
          </div>
          
          <QueueStatusBadge count={turnos.length} />
        </div>
      </div>
      
      {/* Client list */}
      <div className="p-5">
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
            className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              turnos.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow"
            }`}
          >
            {turnos.length === 0 ? (
              "Cola vacía"
            ) : (
              <>
                Llamar siguiente cliente
                <ChevronRight className={`ml-1 w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
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
      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
        Vacía
      </span>
    );
  } else if (count < 5) {
    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
        Fluida
      </span>
    );
  } else if (count < 10) {
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
        Moderada
      </span>
    );
  } else {
    return (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
        Alta demanda
      </span>
    );
  }
}

function ClientRow({ cliente, position, isFirst, isAnimating }) {
  return (
    <div
      className={`p-3 rounded-lg flex justify-between items-center transition-all duration-300 ${
        isFirst 
          ? `bg-blue-50 border border-blue-100 ${isAnimating ? 'animate-pulse' : ''}` 
          : 'bg-gray-50 border border-gray-100'
      }`}
    >
      <div className="flex items-center">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-xs font-semibold ${
          isFirst ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}>
          {position}
        </div>
        <span className={`font-medium ${isFirst ? 'text-blue-800' : 'text-gray-800'}`}>
          {cliente.nombre}
        </span>
      </div>
      
      {isFirst && (
        <div className="flex items-center text-blue-600 text-xs font-medium">
          <Clock className="w-3 h-3 mr-1" />
          Siguiente
        </div>
      )}
    </div>
  );
}

function EmptyQueueMessage() {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
      <p className="text-gray-500 text-sm">
        No hay clientes en espera en esta cola
      </p>
    </div>
  );
}
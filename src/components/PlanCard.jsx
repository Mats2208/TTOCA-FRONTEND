// src/components/PlanCard.jsx
"use client";

import { Check } from "lucide-react";

export default function PlanCard({ nombre, precio, periodo, descripcion, caracteristicas }) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{nombre}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{descripcion}</p>
        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {precio}<span className="text-base font-medium">{periodo}</span>
        </div>
        <ul className="mt-6 space-y-2 text-left">
          {caracteristicas.map((caracteristica, index) => (
            <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              {caracteristica}
            </li>
          ))}
        </ul>
      </div>
      <button 
      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
      onClick={() => window.location.href = "/registro"}>
        Comenzar ahora
      </button>
    </div>
  );
}

import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'

export default function EstadisticasPanel({ proyecto }) {
  // Placeholder stats for the design
  const placeholderStats = [
    { label: "Clientes atendidos", value: "0", icon: <Users size={18} /> },
    { label: "Tiempo promedio", value: "0 min", icon: <Clock size={18} /> },
    { label: "Tendencia", value: "0%", icon: <TrendingUp size={18} /> },
  ]

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Estadísticas</h2>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
            Últimos 30 días
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {placeholderStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-md text-blue-600">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-gray-800 font-medium mb-2">Sin datos estadísticos</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Las estadísticas se mostrarán aquí una vez que comience a atender clientes en su cola virtual.
          </p>
          <button className="text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 px-4 rounded-md transition-colors">
            Iniciar cola para generar estadísticas
          </button>
        </div>
      </div>
    </div>
  )
}

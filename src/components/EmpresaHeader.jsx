import { Building2, MapPin, Clock, Phone, Mail } from 'lucide-react'

export default function EmpresaHeader({ proyecto }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 mb-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg overflow-hidden bg-blue-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
          {proyecto.logo ? (
            <img
              src={proyecto.logo || "/placeholder.svg"}
              alt={proyecto.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-blue-600">
              <Building2 size={28} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">{proyecto.nombre}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
            <p className="text-sm text-gray-500">
              <span className="text-gray-400">Titular:</span> {proyecto.titular}
            </p>
            <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300"></div>
            <p className="text-sm text-gray-500">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
              Activo
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-sm text-gray-600">
        {proyecto.direccion && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-500" />
            <span className="truncate">{proyecto.direccion}</span>
          </div>
        )}
        {proyecto.config?.horario && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <span>{proyecto.config.horario}</span>
          </div>
        )}
        {proyecto.telefono && (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-blue-500" />
            <span>{proyecto.telefono}</span>
          </div>
        )}
        {proyecto.email && (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-blue-500" />
            <span className="truncate">{proyecto.email}</span>
          </div>
        )}
      </div>
    </div>
  )
}

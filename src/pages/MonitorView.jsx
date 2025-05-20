import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, Clock, Bell } from "lucide-react";

const API_URL = import.meta.env.VITE_URL;

export default function MonitorView() {
  const { empresaId } = useParams();
  const [colas, setColas] = useState([]);
  const [turnosActuales, setTurnosActuales] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchColasYTurnos = async () => {
      try {
        const resColas = await fetch(`${API_URL}/api/configuracion/${empresaId}`);
        const dataColas = await resColas.json();
        const categorias = dataColas.categorias || [];
        setColas(categorias);

        const turnosTemp = {};
        for (const cola of categorias) {
          try {
            const resTurno = await fetch(
              `${API_URL}/api/proyectos/${empresaId}/cola/${cola.id}/turno-actual`
            );
            const dataTurno = await resTurno.json();
            if (dataTurno) turnosTemp[cola.id] = dataTurno;
          } catch (err) {
            console.error(`Error al obtener turno actual de ${cola.nombre}`, err);
          }
        }

        setTurnosActuales(turnosTemp);
      } catch (err) {
        console.error("Error al obtener colas o turnos", err);
      }
    };

    fetchColasYTurnos();
    const interval = setInterval(fetchColasYTurnos, 5000);
    return () => clearInterval(interval);
  }, [empresaId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-violet-50/50 pointer-events-none" />
      <div className="absolute -left-64 -top-64 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
      <div className="absolute -right-64 -bottom-64 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div
            className={`transform transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Monitor de Turnos
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              Pantalla{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-700">
                Pública
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Visualización en tiempo real de los turnos actuales
            </p>
          </div>
        </header>

        {/* Modern Frame */}
        <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          {/* Queue Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {colas.length === 0 ? (
              <EmptyState />
            ) : (
              colas.map((cola) => (
                <QueueCard
                  key={cola.id}
                  cola={cola}
                  turno={turnosActuales[cola.id]}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QueueCard({ cola, turno }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-100 h-[400px] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-violet-50">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{cola.nombre}</h3>
          <div className="flex items-center text-blue-600 bg-white p-2 rounded-full shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Current Turn Display */}
      <div className="flex-1 p-8 flex items-center justify-center">
        {turno ? (
          <div className="space-y-6 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200/20 rounded-full blur-xl transform animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full">
                <span className="text-5xl font-bold text-white">
                  {turno.numero}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-gray-800">
                {turno.nombre}
              </h4>
              <p className="text-sm text-gray-500 font-medium">Turno Actual</p>
            </div>
            <div className="inline-flex items-center justify-center space-x-2 text-green-600 bg-green-50 px-6 py-3 rounded-full shadow-sm border border-green-100">
              <Bell className="w-4 h-4" />
              <span className="font-medium">En Atención</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6 shadow-inner">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Esperando próximo turno...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-white p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mb-6">
          <Bell className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          No hay colas configuradas
        </h3>
        <p className="text-gray-600 max-w-md mx-auto text-lg">
          Cuando se configuren las colas, los turnos aparecerán aquí
          automáticamente.
        </p>
      </div>
    </div>
  );
}
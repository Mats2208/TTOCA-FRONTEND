import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, Clock, Bell } from "lucide-react";
import { useEmpresaWebSocket } from "../hooks/useWebSocket";

const API_URL = import.meta.env.VITE_URL;

export default function MonitorView() {
  const { empresaId } = useParams();
  const [colas, setColas] = useState([]);
  const [turnosActuales, setTurnosActuales] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Cargar configuración inicial de colas
  useEffect(() => {
    const fetchColas = async () => {
      try {
        const resColas = await fetch(`${API_URL}/api/configuracion/${empresaId}`);
        const dataColas = await resColas.json();
        const categorias = dataColas.categorias || [];
        setColas(categorias);

        // Cargar turnos actuales iniciales
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
        console.error("Error al obtener colas", err);
      }
    };

    fetchColas();
  }, [empresaId]);

  // Usar WebSocket para actualizaciones en tiempo real
  useEmpresaWebSocket({
    empresaId,
    onTurnoLlamado: (data) => {
      // Actualizar el turno actual de la cola específica
      setTurnosActuales((prev) => ({
        ...prev,
        [data.colaId]: data.turno,
      }));
    },
    enabled: !!empresaId,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 to-secondary-50/40 pointer-events-none" />
      <div className="absolute -left-64 -top-64 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-pulse-subtle" />
      <div className="absolute -right-64 -bottom-64 w-96 h-96 bg-secondary-200/40 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '2s'}} />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div
            className={`transform transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-block bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-soft border border-primary-200/50">
              Monitor de Turnos en Tiempo Real
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
              Pantalla{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Pública
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-xl font-medium">
              Visualización en tiempo real de los turnos actuales
            </p>
          </div>
        </header>

        {/* Modern Frame */}
        <div className="relative bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-elevated border border-white/50">
          {/* Queue Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {colas.length === 0 ? (
              <EmptyState />
            ) : (
              colas.map((cola, index) => (
                <QueueCard
                  key={cola.id}
                  cola={cola}
                  turno={turnosActuales[cola.id]}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QueueCard({ cola, turno, index }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-elevated hover:border-primary-200 h-[450px] flex flex-col animate-slide-up"
      style={{animationDelay: `${index * 0.1}s`}}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 bg-[length:200%_100%] animate-[gradient_5s_ease_infinite]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{cola.nombre}</h3>
          <div className="flex items-center text-primary-600 bg-white p-2.5 rounded-xl shadow-soft">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Current Turn Display */}
      <div className="flex-1 p-8 flex items-center justify-center">
        {turno ? (
          <div className="space-y-6 w-full text-center animate-fade-in">
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200/40 to-secondary-200/40 rounded-full blur-2xl transform animate-pulse-subtle" />
              <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl shadow-elevated">
                <span className="text-6xl font-extrabold text-white drop-shadow-lg">
                  {turno.numero}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-bold text-gray-800">
                {turno.nombre}
              </h4>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Turno Actual</p>
            </div>
            <div className="inline-flex items-center justify-center space-x-2 text-success-700 bg-gradient-to-r from-success-50 to-success-100 px-6 py-3 rounded-xl shadow-soft border-2 border-success-200">
              <Bell className="w-5 h-5" />
              <span className="font-bold">En Atención</span>
            </div>
          </div>
        ) : (
          <div className="text-center animate-pulse-subtle">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 shadow-soft">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 font-semibold text-lg">Esperando próximo turno...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full animate-fade-in">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-elevated border border-gray-200 p-16 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl mb-8 shadow-card animate-pulse-subtle">
          <Bell className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          No hay colas configuradas
        </h3>
        <p className="text-gray-600 max-w-lg mx-auto text-xl font-medium">
          Cuando se configuren las colas, los turnos aparecerán aquí
          automáticamente.
        </p>
      </div>
    </div>
  );
}

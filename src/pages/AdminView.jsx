import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, Users, AlertCircle, ChevronRight } from "lucide-react";
import QueueCard from "../components/QueueCard";
import { useEmpresaWebSocket } from "../hooks/useWebSocket";

const API_URL = import.meta.env.VITE_URL

export default function AdminView() {
  const { empresaId } = useParams();
  const [colas, setColas] = useState([]);
  const [turnosPorCola, setTurnosPorCola] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const fetchColasYTurnos = async () => {
    try {
      // Obtener todas las colas de la empresa
      const resColas = await fetch(`${API_URL}/api/configuracion/${empresaId}`);
      const dataColas = await resColas.json();
      const categorias = dataColas.categorias || [];
      setColas(categorias);

      // Obtener turnos para cada cola
      const turnosNuevos = {};
      for (const cola of categorias) {
        const resTurnos = await fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${cola.id}`);
        const dataTurnos = await resTurnos.json();
        turnosNuevos[cola.id] = dataTurnos.turnos || [];
      }

      setTurnosPorCola(turnosNuevos);
      setIsLoading(false);
    } catch (err) {
      console.error("Error al cargar colas o turnos", err);
      setIsLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchColasYTurnos();
  }, [empresaId]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // WebSocket para actualizaciones en tiempo real
  useEmpresaWebSocket({
    empresaId,
    onQueueUpdate: (data) => {
      // Actualizar turnos de la cola específica
      setTurnosPorCola((prev) => ({
        ...prev,
        [data.colaId]: data.turnos,
      }));
    },
    onTurnoLlamado: async (data) => {
      // Forzar actualización de turnos cuando se llama al siguiente
      console.log('Turno llamado, actualizando cola:', data.colaId);
      try {
        const resTurnos = await fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${data.colaId}`);
        const dataTurnos = await resTurnos.json();
        setTurnosPorCola((prev) => ({
          ...prev,
          [data.colaId]: dataTurnos.turnos || [],
        }));
      } catch (err) {
        console.error("Error al actualizar turnos después de llamado:", err);
      }
    },
    enabled: !!empresaId,
  });

  const llamarSiguiente = (colaId) => {
    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaId}/siguiente`, {
      method: "POST",
    })
      .catch((err) => console.error("Error al llamar siguiente", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-secondary-50/20 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -left-64 top-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-pulse-subtle" />
      <div className="absolute -right-64 bottom-0 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}} />

      <div
        className={`max-w-6xl mx-auto relative transform transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <Header />

        {isLoading ? (
          <LoadingState />
        ) : (
          <section className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {colas.length === 0 ? (
              <EmptyState />
            ) : (
              colas.map((cola, index) => (
                <div key={cola.id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <QueueCard
                    cola={cola}
                    turnos={turnosPorCola[cola.id] || []}
                    onLlamarSiguiente={llamarSiguiente}
                  />
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-12 animate-fade-in">
      <div className="inline-block bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-soft border border-primary-200/50">
        Panel de Administración
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
        Gestión de{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
          Colas
        </span>
      </h1>
      <p className="text-gray-600 text-base md:text-lg max-w-2xl font-medium">
        Administra y controla todas las colas de atención en tiempo real
      </p>
    </header>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full animate-fade-in">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-elevated border border-gray-200 p-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl mb-6 shadow-card animate-pulse-subtle">
          <AlertCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          No hay colas configuradas
        </h3>
        <p className="text-gray-600 text-lg">
          Crea tu primera cola para comenzar a gestionar turnos.
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent shadow-soft"></div>
        <p className="mt-6 text-gray-600 text-lg font-medium">Cargando colas...</p>
      </div>
    </div>
  );
}

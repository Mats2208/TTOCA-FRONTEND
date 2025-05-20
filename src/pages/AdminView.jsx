import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, Users, AlertCircle, ChevronRight } from "lucide-react";
import QueueCard from "../components/QueueCard";

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

  useEffect(() => {
    fetchColasYTurnos();
    const intervalo = setInterval(fetchColasYTurnos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const llamarSiguiente = (colaId) => {
    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaId}/siguiente`, {
      method: "POST",
    })
      .then(() => fetchColasYTurnos())
      .catch((err) => console.error("Error al llamar siguiente", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div 
        className={`max-w-6xl mx-auto transform transition-all duration-700 ease-out ${
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
              colas.map((cola) => (
                <QueueCard 
                  key={cola.id} 
                  cola={cola} 
                  turnos={turnosPorCola[cola.id] || []} 
                  onLlamarSiguiente={llamarSiguiente}
                />
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
    <header className="mb-8 text-center">
      <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
        Panel de Control
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
        Vista <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-700">Administrativa</span>
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Gestiona las colas y atiende a los clientes en tiempo real
      </p>
    </header>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
        <div className="h-4 w-40 bg-blue-100 rounded mb-3"></div>
        <div className="h-3 w-28 bg-blue-50 rounded"></div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full bg-white rounded-2xl shadow-md border border-gray-100 p-10 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay colas configuradas</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Necesitas configurar al menos una cola para comenzar a gestionar los turnos de tus clientes.
      </p>
      <a
        href="#"
        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm"
      >
        Configurar colas
      </a>
    </div>
  );
}
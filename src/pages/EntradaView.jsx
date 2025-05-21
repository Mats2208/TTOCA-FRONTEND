import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { QrCode, Users, ArrowRight } from "lucide-react";
import QRCode from "react-qr-code";

const API_URL = import.meta.env.VITE_URL;

export default function EntradaView() {
  const { empresaId, colaId } = useParams();
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [colas, setColas] = useState([]);
  const [colaSeleccionada, setColaSeleccionada] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/configuracion/${empresaId}`)
      .then((res) => res.json())
      .then((data) => {
        const disponibles = data.categorias || [];
        setColas(disponibles);
        setColaSeleccionada(
          disponibles.find((c) => c.id === colaId) || disponibles[0]
        );
      })
      .catch((err) => console.error("Error al cargar colas", err));
  }, [empresaId, colaId]);

  const obtenerTurno = () => {
    if (!nombre.trim() || !colaSeleccionada) return;

    fetch(`${API_URL}/api/proyectos/${empresaId}/cola/${colaSeleccionada.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        tipo: colaSeleccionada.nombre,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const turno = data.turno;
        setMensaje(
          `¡Turno generado para ${turno.nombre} (#${turno.numero})!\nCódigo de seguimiento:\n${turno.codigo}`
        );
        setNombre("");
      })
      .catch((err) => {
        console.error("Error al registrar cliente", err);
        setMensaje("Hubo un error al generar el turno");
      });
  };

  const currentURL = `${window.location.origin}/mi-turno/${empresaId}`;

  return (    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-sky-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 to-blue-50/50 pointer-events-none" />
      <div className="absolute -left-64 -top-64 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl" />
      <div className="absolute -right-64 -bottom-64 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />

      <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center gap-12">        {/* QR Section - Hidden on mobile */}
        <div
          className={`hidden md:block flex-1 w-full transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
            <div className="inline-block bg-cyan-100 text-cyan-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Acceso Rápido
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Escanea el código QR
            </h2>
            <div className="bg-white p-6 rounded-2xl shadow-lg inline-block mb-8">
              <QRCode value={currentURL} size={280} />
            </div>
            <p className="text-gray-600 text-lg max-w-sm mx-auto">
              Solicita tu turno directamente desde tu teléfono escaneando el código
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div
          className={`flex-1 w-full transform transition-all duration-700 delay-200 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">              <div className="inline-block bg-cyan-100 text-cyan-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Solicitud de Turno
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Ingresa tus datos
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese su nombre"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cola"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tipo de atención
                </label>
                <select
                  id="cola"
                  value={colaSeleccionada?.id || ""}
                  onChange={(e) =>
                    setColaSeleccionada(colas.find((c) => c.id === e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                >
                  {colas.map((cola) => (
                    <option key={cola.id} value={cola.id}>
                      {cola.nombre}
                    </option>
                  ))}
                </select>
              </div>              <button
                onClick={obtenerTurno}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Obtener Turno</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {mensaje && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-center font-medium">
                  {mensaje}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
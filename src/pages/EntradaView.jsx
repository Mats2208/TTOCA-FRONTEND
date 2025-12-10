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
  const [turnoGenerado, setTurnoGenerado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

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
        setTurnoGenerado(turno);
        setMostrarModal(true);
        setNombre("");
        setMensaje("");
      })
      .catch((err) => {
        console.error("Error al registrar cliente", err);
        setMensaje("Hubo un error al generar el turno");
      });
  };

  const currentURL = `${window.location.origin}/mi-turno/${empresaId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 to-secondary-50/40 pointer-events-none" />
      <div className="absolute -left-64 -top-64 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-pulse-subtle" />
      <div className="absolute -right-64 -bottom-64 w-96 h-96 bg-secondary-200/40 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}} />

      <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center gap-12">
        {/* QR Section - Hidden on mobile */}
        <div
          className={`hidden md:block flex-1 w-full transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-10 shadow-elevated border border-white/50 text-center">
            <div className="inline-block bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-5 py-2 rounded-full text-sm font-semibold mb-8 shadow-soft border border-primary-200/50">
              Acceso Rápido
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-10">
              Escanea el código QR
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-card inline-block mb-8 border-2 border-primary-100">
              <QRCode value={currentURL} size={280} />
            </div>
            <p className="text-gray-600 text-lg max-w-sm mx-auto font-medium">
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
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-10 shadow-elevated border border-white/50">
            <div className="text-center mb-10">
              <div className="inline-block bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-soft border border-primary-200/50">
                Solicitud de Turno
              </div>
              <h2 className="text-4xl font-bold text-gray-800">
                Ingresa tus datos
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese su nombre"
                  className="w-full px-5 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none text-base"
                  onKeyPress={(e) => e.key === 'Enter' && obtenerTurno()}
                />
              </div>

              <div>
                <label
                  htmlFor="cola"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Tipo de atención
                </label>
                <select
                  id="cola"
                  value={colaSeleccionada?.id || ""}
                  onChange={(e) =>
                    setColaSeleccionada(colas.find((c) => c.id === e.target.value))
                  }
                  className="w-full px-5 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none text-base"
                >
                  {colas.map((cola) => (
                    <option key={cola.id} value={cola.id}>
                      {cola.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={obtenerTurno}
                disabled={!nombre.trim()}
                className={`w-full py-5 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-card text-lg ${
                  !nombre.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-elevated text-white hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <span>Obtener Turno</span>
                <ArrowRight className="w-6 h-6" />
              </button>

              {mensaje && (
                <div className="bg-gradient-to-r from-danger-50 to-danger-100 text-danger-700 p-4 rounded-xl border-2 border-danger-200 text-center font-semibold animate-fade-in">
                  {mensaje}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación con turno generado */}
      {mostrarModal && turnoGenerado && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-elevated max-w-md w-full overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-center">
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">¡Turno Generado!</h3>
              <p className="text-white/90 text-lg">Tu turno ha sido registrado exitosamente</p>
            </div>

            <div className="p-8 text-center">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-600 font-semibold mb-2">NOMBRE</p>
                <p className="text-2xl font-bold text-gray-800 mb-4">{turnoGenerado.nombre}</p>

                <p className="text-sm text-gray-600 font-semibold mb-2">NÚMERO DE TURNO</p>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mb-4 shadow-card">
                  <span className="text-4xl font-extrabold text-white">{turnoGenerado.numero}</span>
                </div>

                <p className="text-sm text-gray-600 font-semibold mb-2">CÓDIGO DE SEGUIMIENTO</p>
                <p className="text-lg font-mono font-bold text-primary-700 bg-white px-4 py-3 rounded-xl border-2 border-primary-200">{turnoGenerado.codigo}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-soft inline-block mb-6 border-2 border-primary-100">
                <QRCode value={`${window.location.origin}/mi-turno/${empresaId}?codigo=${turnoGenerado.codigo}`} size={200} />
              </div>

              <p className="text-sm text-gray-600 mb-6 font-medium">
                Guarda este código para verificar el estado de tu turno
              </p>

              <button
                onClick={() => {
                  setMostrarModal(false);
                  setTurnoGenerado(null);
                }}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 px-6 rounded-xl font-bold transition-all duration-200 hover:shadow-card hover:scale-[1.02] active:scale-[0.98]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
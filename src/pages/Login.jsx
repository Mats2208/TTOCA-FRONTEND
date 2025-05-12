import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError("")
  setSuccess(false)

  try {
    // Simular espera de llamada al backend
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Validación de usuario simulado
    const { correo, contrasena } = formData
    const usuarioValido = correo === "test@gmail.com" && contrasena === "123456"

    if (!usuarioValido) {
      throw new Error("Credenciales inválidas")
    }

    // Guardar sesión en localStorage
    localStorage.setItem("ttoca_session", JSON.stringify({
      correo,
      fecha: new Date().toISOString()
    }))

    // Éxito visual
    setSuccess(true)

    // Redirigir al dashboard luego de 2 segundos
    setTimeout(() => {
      navigate("/Home")
    }, 2000)

  } catch (err) {
    setError(err.message || "Error al iniciar sesión. Inténtalo de nuevo.")
  } finally {
    setLoading(false)
  }
}

  return (
    <section className="py-16 px-4 md:py-24 bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center">
      <div className="max-w-md mx-auto w-full">
        {success ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Inicio de sesión exitoso!</h2>
            <p className="text-gray-600 mb-6">
              Bienvenido de vuelta. Serás redirigido al dashboard en unos segundos.
            </p>
            <div className="animate-pulse bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm">
              Redirigiendo...
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Bienvenido de vuelta
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Inicia sesión</h2>
              <p className="text-gray-600">Accede a tu cuenta para gestionar tus filas</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-blue-400" />
                        </div>
                        <input
                          type="email"
                          id="correo"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-colors"
                          placeholder="tu@ejemplo.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-blue-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="contrasena"
                          name="contrasena"
                          value={formData.contrasena}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-colors"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="flex justify-end mt-2">
                        <a href="/recuperar" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start">
                        <div className="flex-shrink-0 mr-2">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        {error}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                          loading ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Iniciando sesión...
                          </span>
                        ) : (
                          "Iniciar sesión"
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <a href="/registro" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Regístrate
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Login
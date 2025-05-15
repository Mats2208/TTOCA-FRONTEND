import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

const Registro = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    correo: "",
    contrasena: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

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

    setTimeout(() => {
      window.location.href = "/login"
    }, 500)

    try{
      const { usuario, correo, contrasena } = formData

      const res = await fetch("https://test-ii63.onrender.com/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({usuario, correo, contrasena})
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar. Inténtalo de nuevo.")
      }

    } catch (err) {
      setError(err.message || "Error al registrar. Inténtalo de nuevo.")
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Registro exitoso!</h2>
            <p className="text-gray-600 mb-6">
              Tu cuenta ha sido creada correctamente. Revisa tu correo electrónico para verificar tu cuenta.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Iniciar sesión
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Únete a nosotros
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Crea tu cuenta</h2>
              <p className="text-gray-600">Comienza a gestionar tus filas de manera eficiente</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                        Usuario
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <input
                          type="text"
                          id="usuario"
                          name="usuario"
                          value={formData.usuario}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-colors"
                          placeholder="Ingresa tu nombre de usuario"
                          required
                        />
                      </div>
                    </div>

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
                      <p className="mt-2 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
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
                            Registrando...
                          </span>
                        ) : (
                          "Crear cuenta"
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Inicia sesión
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

export default Registro
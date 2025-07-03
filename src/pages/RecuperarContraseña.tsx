import { useState } from "react";
import supabase from "../services/supabaseClient";

function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleEnviarLink = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL + "/nueva-clave",
    });

    if (error) {
      alert("❌ Error: " + error.message);
    } else {
      setEnviado(true);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%)",
      }}
    >
      {/* Formas curvas decorativas */}
      <div className="absolute inset-0">
        {/* Círculo grande superior derecho */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30"
          style={{ backgroundColor: "#ff4500" }}
        ></div>

        {/* Círculo mediano inferior izquierdo */}
        <div
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: "#ff6347" }}
        ></div>

        {/* Forma curva superior */}
        <div
          className="absolute top-0 left-0 w-full h-40 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at top, #ff4500 0%, transparent 70%)",
          }}
        ></div>

        {/* Forma curva inferior */}
        <div
          className="absolute bottom-0 right-0 w-80 h-80 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at bottom right, #ff6347 0%, transparent 60%)",
            borderRadius: "50% 50% 0 50%",
          }}
        ></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/assets/images/image.png"
              alt="Logo"
              className="w-32 mx-auto mb-4"
            />
            <p className="text-gray-600 text-sm">
              Ingresa tu correo para recuperar tu contraseña
            </p>
          </div>

          {/* Título */}
          <h2 className="text-center font-bold text-2xl mb-6 text-gray-800">
            Recuperar Contraseña
          </h2>

          {enviado ? (
            // Estado después de enviar
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700 font-medium">📧 ¡Correo enviado!</p>
                <p className="text-gray-600 text-sm">
                  Revisa tu bandeja de entrada y sigue las instrucciones para
                  restablecer tu contraseña.
                </p>
                <p className="text-gray-500 text-xs">
                  Si no encuentras el correo, revisa tu carpeta de spam.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setEnviado(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Enviar nuevamente
                </button>

                <a
                  href="/login"
                  className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
                >
                  Volver al Login
                </a>
              </div>
            </div>
          ) : (
            // Formulario inicial
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  Ingresa tu correo electrónico y te enviaremos un enlace para
                  restablecer tu contraseña.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-500"
                />
              </div>

              <button
                onClick={handleEnviarLink}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
              >
                Enviar enlace
              </button>

              <div className="text-center">
                <a
                  href="/login"
                  className="text-sm text-orange-600 hover:text-orange-700 underline"
                >
                  ← Volver al inicio de sesión
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecuperarContraseña;

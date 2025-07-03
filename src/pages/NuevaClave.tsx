import { useState } from "react";
import supabase from "../services/supabaseClient";

function NuevaClave() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleCambiar = async () => {
    if (password !== confirmar) {
      alert("❌ Las contraseñas no coinciden");
      setPassword("");
      setConfirmar("");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      alert("❌ Error: " + error.message);
    } else {
      setMensaje("✅ Contraseña actualizada. Puedes iniciar sesión.");
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
          </div>

          {/* Título */}
          <h2 className="text-center font-bold text-2xl mb-6 text-gray-800">
            Nueva Contraseña
          </h2>

          {mensaje ? (
            // Estado de éxito
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="space-y-3">
                <p className="text-green-600 font-medium text-lg">
                  ✅ ¡Contraseña actualizada!
                </p>
                <p className="text-gray-600 text-sm">
                  Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar
                  sesión con tu nueva contraseña.
                </p>
              </div>

              <a
                href="/login"
                className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
              >
                Ir a Iniciar Sesión
              </a>
            </div>
          ) : (
            // Formulario de nueva contraseña
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2L3.257 9.257a6 6 0 017.743-7.743L15 7z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  Ingresa tu nueva contraseña. Asegúrate de que sea segura y
                  fácil de recordar.
                </p>
              </div>

              <div className="space-y-4">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-500"
                  />
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>

              <button
                onClick={handleCambiar}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Cambiar contraseña
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

export default NuevaClave;

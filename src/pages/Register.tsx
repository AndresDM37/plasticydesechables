import { useState } from "react";
import supabase from "../services/supabaseClient";

function Register() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombres: form.nombres,
          apellidos: form.apellidos,
        },
      },
    });

    if (error) {
      alert("Error al registrarse: " + error.message);
    } else {
      alert("Usuario registrado correctamente ✅ Revisa tu correo.");
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
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-8">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/assets/images/image.png"
              alt="Logo"
              className="w-[200px] mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">Registrarse</h1>
           
          </div>

          {/* Formulario */}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                name="nombres"
                type="text"
                placeholder="NOMBRES"
                onChange={handleChange}
                value={form.nombres}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                name="apellidos"
                type="text"
                placeholder="APELLIDOS"
                onChange={handleChange}
                value={form.apellidos}
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
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                name="email"
                type="email"
                placeholder="CORREO ELECTRÓNICO"
                onChange={handleChange}
                value={form.email}
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                name="password"
                type="password"
                placeholder="CONTRASEÑA"
                onChange={handleChange}
                value={form.password}
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
                name="confirm"
                type="password"
                placeholder="CONFIRMAR CONTRASEÑA"
                onChange={handleChange}
                value={form.confirm}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-500"
              />
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
            >
              REGISTRARSE
            </button>
          </div>

          {/* Enlaces */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                className="text-orange-600 hover:text-orange-700 underline cursor-pointer"
              >
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

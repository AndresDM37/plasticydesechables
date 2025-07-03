import { useAuth } from "../hooks/useAuth";
import Layout from "./Layout";

function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  const nombre = user?.user_metadata?.nombres || "NOMBRE DE USUARIO";

  return (
    <Layout>
      <div className="flex items-center justify-center h-full bg-white px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-4 leading-tight">
            BIENVENIDO{" "}
            <span className="text-orange-500 font-normal block sm:inline mt-2 sm:mt-0">
              {nombre.toUpperCase()}
            </span>
          </h1>
        </div>
      </div>
    </Layout>
  );
}

export default Home;

import { useEffect, useState } from "react";
import type { Producto } from "../types/index";
import {
  obtenerProductos,
  eliminarProductoPorId,
  crearProducto,
  actualizarProducto,
} from "../utils/producto";

import FormularioProducto from "../components/FormProductos";
import Layout from "./Layout";

function ListaProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(
    null
  );
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await obtenerProductos();
    setProductos(data);
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      await eliminarProductoPorId(id);
      cargar();
    }
  };

  const abrirNuevoProducto = () => {
    setProductoEnEdicion(null);
    setMostrarFormulario(true);
  };

  const editarProducto = (producto: Producto) => {
    setProductoEnEdicion(producto);
    setMostrarFormulario(true);
  };

  const guardarProducto = async (producto: Partial<Producto>) => {
    if (productoEnEdicion) {
      await actualizarProducto(productoEnEdicion.id, producto);
      alert("✅ Producto editado correctamente.");
    } else {
      await crearProducto(producto);
      alert("✅ Producto creado correctamente.");
    }
    setMostrarFormulario(false);
    cargar();
  };

  const cancelar = () => {
    setMostrarFormulario(false);
    setProductoEnEdicion(null);
  };

  // Filtros y paginación
  const productosFiltrados = productos.filter(
    (producto) =>
      busqueda === "" ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.id.toString().includes(busqueda)
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(
    inicio,
    inicio + itemsPorPagina
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Gestión de Productos
            </h1>
            <p className="text-gray-600 text-sm">
              Administra tu catálogo de productos
            </p>
          </div>

          {/* Barra de búsqueda y botón agregar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="🔍 Buscar producto..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <button
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-150 flex items-center gap-2 cursor-pointer"
              onClick={abrirNuevoProducto}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">Añadir Producto</span>
              <span className="sm:hidden">Añadir</span>
            </button>
          </div>

          {/* Popup Formulario */}
          {mostrarFormulario && (
            <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {productoEnEdicion ? "Editar Producto" : "Nuevo Producto"}
                    </h2>
                    <button
                      onClick={cancelar}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <FormularioProducto
                    onGuardar={guardarProducto}
                    productoEditar={productoEnEdicion}
                    onCancelar={cancelar}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Lista de productos - Desktop */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio 2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productosPaginados.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {producto.id.toString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {producto.descripcion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${producto.precio_venta?.toLocaleString("es-CO") ?? "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${producto.precio_venta2?.toLocaleString("es-CO") ?? "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        className="px-3 py-1 bg-orange-400 hover:bg-orange-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                        onClick={() => editarProducto(producto)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                        onClick={() => eliminar(producto.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lista de productos - Mobile/Tablet */}
          <div className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {productosPaginados.map((producto) => (
                <div key={producto.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">
                          {producto.id.toString()}
                        </span>
                      </div>

                      <h3 className="text-sm font-medium text-gray-900 mb-2 truncate">
                        {producto.descripcion}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="text-xs text-gray-500">
                            Precio 1:
                          </span>
                          <span className="ml-1 font-medium">
                            $
                            {producto.precio_venta?.toLocaleString("es-CO") ??
                              "0"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">
                            Precio 2:
                          </span>
                          <span className="ml-1 font-medium">
                            $
                            {producto.precio_venta2?.toLocaleString("es-CO") ??
                              "0"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                          onClick={() => editarProducto(producto)}
                        >
                          Editar
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors duration-150 cursor-pointer"
                          onClick={() => eliminar(producto.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje cuando no hay productos */}
          {productosPaginados.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {busqueda ? "No se encontraron productos" : "No hay productos"}
              </h3>
              <p className="text-sm text-gray-500">
                {busqueda
                  ? "Intenta con otra búsqueda"
                  : "Comienza agregando tu primer producto"}
              </p>
            </div>
          )}

          {/* Paginación */}
          {productosFiltrados.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ítems por página</span>
                <select
                  value={itemsPorPagina}
                  onChange={(e) => {
                    setItemsPorPagina(Number(e.target.value));
                    setPaginaActual(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {inicio + 1} -{" "}
                  {Math.min(inicio + itemsPorPagina, productosFiltrados.length)}{" "}
                  de {productosFiltrados.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setPaginaActual(Math.max(1, paginaActual - 1))
                    }
                    disabled={paginaActual === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
                    }
                    disabled={paginaActual === totalPaginas}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ListaProductos;
